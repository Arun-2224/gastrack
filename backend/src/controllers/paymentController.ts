import { Response, NextFunction } from 'express';
import { Payment } from '../models/Payment';
import { Customer } from '../models/Customer';
import { Delivery } from '../models/Delivery';
import { createPaymentSchema } from '../validators/schemas';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

export const getPayments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 25, paymentMethod, status, customerId } = req.query;
    const query: any = {};

    if (paymentMethod && paymentMethod !== 'ALL') {
      query.paymentMethod = paymentMethod;
    }
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('customer', 'customerId name phone outstandingBalance')
        .populate('delivery', 'deliveryId paymentAmount paymentStatus deliveryStatus')
        .populate('recordedBy', 'name role')
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Payment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: payments,
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

export const createPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createPaymentSchema.parse(req.body);

    const customer = await Customer.findById(data.customerId);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const count = await Payment.countDocuments();
    const paymentId = `PAY-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const payment = await Payment.create({
      paymentId,
      customer: customer._id,
      delivery: data.deliveryId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      status: 'COMPLETED',
      recordedBy: req.user!._id,
      paymentDate: new Date(),
    });

    // Update customer outstanding balance
    customer.outstandingBalance = Math.max(0, (customer.outstandingBalance || 0) - data.amount);
    await customer.save();

    // If delivery linked, update delivery payment status
    if (data.deliveryId) {
      const delivery = await Delivery.findById(data.deliveryId);
      if (delivery) {
        if (data.amount >= delivery.paymentAmount) {
          delivery.paymentStatus = 'PAID';
        } else {
          delivery.paymentStatus = 'PARTIAL';
        }
        await delivery.save();
      }
    }

    await logAudit({
      user: req.user?._id,
      action: 'PAYMENT_CREATE',
      entity: 'Payment',
      entityId: payment.paymentId,
      description: `Recorded payment ${payment.paymentId} of $${payment.amount} via ${payment.paymentMethod} from ${customer.name}`,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalRevenue, byMethod, recentPayments] = await Promise.all([
      Payment.aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Payment.find({ status: 'COMPLETED' })
        .populate('customer', 'name customerId')
        .sort({ paymentDate: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        byMethod,
        recentPayments,
      },
    });
  } catch (error) {
    next(error);
  }
};
