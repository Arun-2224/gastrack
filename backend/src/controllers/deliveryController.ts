import { Response, NextFunction } from 'express';
import { Delivery } from '../models/Delivery';
import { Customer } from '../models/Customer';
import { Cylinder } from '../models/Cylinder';
import { Payment } from '../models/Payment';
import { Location } from '../models/Location';
import { CylinderLifecycleService } from '../services/cylinderLifecycleService';
import { createDeliverySchema, updateDeliveryStatusSchema } from '../validators/schemas';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

export const getDeliveries = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 25,
      deliveryStatus,
      paymentStatus,
      staffId,
      customerId,
      search,
    } = req.query;

    const query: any = {};

    if (deliveryStatus && deliveryStatus !== 'ALL') {
      query.deliveryStatus = deliveryStatus;
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      query.paymentStatus = paymentStatus;
    }

    if (staffId) {
      query.deliveryStaff = staffId;
    }

    if (customerId) {
      query.customer = customerId;
    }

    if (search) {
      query.deliveryId = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const [deliveries, total] = await Promise.all([
      Delivery.find(query)
        .populate('customer', 'customerId name phone address city customerType outstandingBalance')
        .populate('deliveryStaff', 'name phone email role')
        .populate('cylinder', 'serialNumber cylinderType capacity status brand')
        .sort({ scheduledDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Delivery.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: deliveries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id)
      .populate('customer')
      .populate('deliveryStaff', 'name phone email')
      .populate('cylinder');

    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery not found' });
      return;
    }

    const payments = await Payment.find({ delivery: delivery._id });

    res.status(200).json({ success: true, delivery, payments });
  } catch (error) {
    next(error);
  }
};

export const createDelivery = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createDeliverySchema.parse(req.body);

    const customer = await Customer.findById(data.customerId);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    let cylinderDoc = null;
    if (data.cylinderId) {
      cylinderDoc = await Cylinder.findById(data.cylinderId);
      if (!cylinderDoc) {
        res.status(404).json({ success: false, message: 'Selected cylinder not found' });
        return;
      }

      // Enforce business rules
      if (['LOST', 'RETIRED', 'DAMAGED', 'MAINTENANCE'].includes(cylinderDoc.status)) {
        res.status(400).json({
          success: false,
          message: `Cannot assign cylinder ${cylinderDoc.serialNumber} with status '${cylinderDoc.status}' to a delivery.`,
        });
        return;
      }
    }

    const count = await Delivery.countDocuments();
    const deliveryId = `DEL-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const delivery = await Delivery.create({
      deliveryId,
      customer: customer._id,
      deliveryStaff: data.deliveryStaffId || undefined,
      scheduledDate: new Date(data.scheduledDate),
      cylinder: cylinderDoc?._id,
      quantity: data.quantity || 1,
      deliveryAddress: data.deliveryAddress,
      paymentAmount: data.paymentAmount,
      paymentStatus: 'UNPAID',
      deliveryStatus: data.deliveryStaffId ? 'ASSIGNED' : 'PENDING',
      notes: data.notes,
    });

    // If cylinder was assigned, update cylinder lifecycle state
    if (cylinderDoc) {
      await CylinderLifecycleService.transitionStatus({
        cylinderId: cylinderDoc._id,
        newStatus: 'ASSIGNED',
        userId: req.user!._id as any,
        notes: `Assigned to delivery ${delivery.deliveryId} for customer ${customer.name}`,
        req,
      });
    }

    await logAudit({
      user: req.user?._id,
      action: 'DELIVERY_CREATE',
      entity: 'Delivery',
      entityId: delivery.deliveryId,
      description: `Created delivery ${delivery.deliveryId} for customer ${customer.name}`,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Delivery scheduled successfully',
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateDeliveryStatusSchema.parse(req.body);

    const delivery = await Delivery.findById(id).populate('customer').populate('cylinder');
    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery not found' });
      return;
    }

    const prevStatus = delivery.deliveryStatus;
    delivery.deliveryStatus = data.deliveryStatus;
    if (data.notes) delivery.notes = data.notes;

    // Delivery completed flow
    if (data.deliveryStatus === 'DELIVERED') {
      delivery.deliveryDate = new Date();

      // Find or assign cylinder
      let cylinderId = delivery.cylinder?._id || data.cylinderId;
      if (!cylinderId) {
        res.status(400).json({
          success: false,
          message: 'Delivery completion requires an assigned cylinder.',
        });
        return;
      }

      // Transition delivered cylinder to DELIVERED
      const customer = delivery.customer as any;
      await CylinderLifecycleService.transitionStatus({
        cylinderId,
        newStatus: 'DELIVERED',
        userId: req.user!._id as any,
        customerId: customer._id,
        notes: `Delivered to customer ${customer.name} via delivery ${delivery.deliveryId}`,
        req,
      });

      // Update customer cylinder count
      customer.cylinderCount = (customer.cylinderCount || 0) + 1;

      // Handle payment if received during delivery
      if (data.paymentReceived) {
        delivery.paymentStatus = 'PAID';
        const payCount = await Payment.countDocuments();
        const paymentId = `PAY-${new Date().getFullYear()}-${String(payCount + 1).padStart(4, '0')}`;

        await Payment.create({
          paymentId,
          customer: customer._id,
          delivery: delivery._id,
          amount: delivery.paymentAmount,
          paymentMethod: data.paymentMethod || 'CASH',
          status: 'COMPLETED',
          recordedBy: req.user!._id,
          paymentDate: new Date(),
        });

        await logAudit({
          user: req.user?._id,
          action: 'PAYMENT_CREATE',
          entity: 'Payment',
          entityId: paymentId,
          description: `Collected payment of $${delivery.paymentAmount} for delivery ${delivery.deliveryId}`,
          req,
        });
      } else {
        // Add to customer's outstanding balance
        customer.outstandingBalance = (customer.outstandingBalance || 0) + delivery.paymentAmount;
      }

      await customer.save();

      // Handle returned empty cylinder if provided
      if (data.returnedCylinderSerial) {
        const returnedCyl = await Cylinder.findOne({
          serialNumber: data.returnedCylinderSerial.trim().toUpperCase(),
        });
        if (returnedCyl) {
          await CylinderLifecycleService.transitionStatus({
            cylinderId: returnedCyl._id,
            newStatus: 'RETURNED',
            userId: req.user!._id as any,
            customerId: null,
            notes: `Empty cylinder returned by ${customer.name} during delivery ${delivery.deliveryId}`,
            req,
          });
        }
      }
    } else if (data.deliveryStatus === 'CANCELLED' || data.deliveryStatus === 'FAILED') {
      // Release cylinder back to AVAILABLE if it was assigned
      if (delivery.cylinder) {
        await CylinderLifecycleService.transitionStatus({
          cylinderId: (delivery.cylinder as any)._id,
          newStatus: 'AVAILABLE',
          userId: req.user!._id as any,
          notes: `Delivery ${delivery.deliveryId} ${data.deliveryStatus.toLowerCase()}; cylinder returned to AVAILABLE`,
          req,
        });
      }
    } else if (data.deliveryStatus === 'OUT_FOR_DELIVERY') {
      if (delivery.cylinder) {
        const vehicleLoc = await Location.findOne({ type: 'DELIVERY_VEHICLE' });
        if (vehicleLoc) {
          const cyl = await Cylinder.findById((delivery.cylinder as any)._id);
          if (cyl) {
            cyl.currentLocation = vehicleLoc._id as any;
            await cyl.save();
          }
        }
      }
    }

    await delivery.save();

    await logAudit({
      user: req.user?._id,
      action: 'DELIVERY_STATUS_CHANGE',
      entity: 'Delivery',
      entityId: delivery.deliveryId,
      description: `Delivery ${delivery.deliveryId} status changed from ${prevStatus} to ${data.deliveryStatus}`,
      req,
    });

    res.status(200).json({
      success: true,
      message: `Delivery status updated to ${data.deliveryStatus}`,
      delivery,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update delivery status',
    });
  }
};

export const getDeliveryStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, byStatus, scheduledToday, deliveredToday] = await Promise.all([
      Delivery.countDocuments(),
      Delivery.aggregate([{ $group: { _id: '$deliveryStatus', count: { $sum: 1 } } }]),
      Delivery.countDocuments({ scheduledDate: { $gte: today } }),
      Delivery.countDocuments({ deliveryDate: { $gte: today }, deliveryStatus: 'DELIVERED' }),
    ]);

    const statusMap: Record<string, number> = {};
    byStatus.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        byStatus: statusMap,
        scheduledToday,
        deliveredToday,
      },
    });
  } catch (error) {
    next(error);
  }
};
