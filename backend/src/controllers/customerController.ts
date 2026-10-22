import { Response, NextFunction } from 'express';
import { Customer } from '../models/Customer';
import { Delivery } from '../models/Delivery';
import { Cylinder } from '../models/Cylinder';
import { createCustomerSchema } from '../validators/schemas';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

export const getCustomers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 25, search, customerType, status } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    if (customerType && customerType !== 'ALL') {
      query.customerType = customerType;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Customer.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: customers,
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

export const getCustomerById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    // Get active cylinders assigned to this customer
    const cylinders = await Cylinder.find({ currentCustomer: customer._id });

    // Get recent deliveries
    const deliveries = await Delivery.find({ customer: customer._id })
      .populate('deliveryStaff', 'name phone')
      .populate('cylinder', 'serialNumber cylinderType')
      .sort({ scheduledDate: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      customer,
      cylinders,
      deliveries,
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createCustomerSchema.parse(req.body);

    const count = await Customer.countDocuments();
    const customerId = `CUST-${String(count + 1001).padStart(5, '0')}`;

    const customer = await Customer.create({
      customerId,
      ...data,
      cylinderCount: 0,
      outstandingBalance: 0,
      status: 'ACTIVE',
    });

    await logAudit({
      user: req.user?._id,
      action: 'CUSTOMER_CREATE',
      entity: 'Customer',
      entityId: customer.customerId,
      description: `Created customer ${customer.name} (${customer.customerId})`,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      customer,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    await logAudit({
      user: req.user?._id,
      action: 'CUSTOMER_UPDATE',
      entity: 'Customer',
      entityId: customer.customerId,
      description: `Updated customer information for ${customer.name}`,
      req,
    });

    res.status(200).json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

export const getCustomerStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [total, byType, totalBalance] = await Promise.all([
      Customer.countDocuments(),
      Customer.aggregate([{ $group: { _id: '$customerType', count: { $sum: 1 } } }]),
      Customer.aggregate([{ $group: { _id: null, totalBalance: { $sum: '$outstandingBalance' } } }]),
    ]);

    const typeMap: Record<string, number> = {};
    byType.forEach((item) => {
      typeMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        byType: typeMap,
        totalOutstanding: totalBalance[0]?.totalBalance || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
