import { Response, NextFunction } from 'express';
import { Cylinder } from '../models/Cylinder';
import { Customer } from '../models/Customer';
import { Delivery } from '../models/Delivery';
import { Payment } from '../models/Payment';
import { Inspection } from '../models/Inspection';
import { Maintenance } from '../models/Maintenance';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const getDashboardSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      cylinderCountsByStatus,
      totalCylinders,
      totalCustomers,
      deliveriesToday,
      completedToday,
      totalRevenue,
      totalOutstanding,
      recentDeliveries,
      recentAlerts,
      inspectionSummary,
      activeMaintenanceCount,
    ] = await Promise.all([
      Cylinder.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Cylinder.countDocuments(),
      Customer.countDocuments({ status: 'ACTIVE' }),
      Delivery.countDocuments({ scheduledDate: { $gte: today } }),
      Delivery.countDocuments({ deliveryDate: { $gte: today }, deliveryStatus: 'DELIVERED' }),
      Payment.aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Customer.aggregate([{ $group: { _id: null, total: { $sum: '$outstandingBalance' } } }]),
      Delivery.find()
        .populate('customer', 'name phone')
        .populate('deliveryStaff', 'name')
        .populate('cylinder', 'serialNumber')
        .sort({ createdAt: -1 })
        .limit(6),
      Notification.find({ isRead: false }).sort({ createdAt: -1 }).limit(5),
      Inspection.aggregate([{ $group: { _id: '$result', count: { $sum: 1 } } }]),
      Maintenance.countDocuments({ status: { $in: ['PENDING', 'IN_PROGRESS'] } }),
    ]);

    // Map cylinder statuses
    const statusMap: Record<string, number> = {
      AVAILABLE: 0,
      FILLED: 0,
      EMPTY: 0,
      ASSIGNED: 0,
      DELIVERED: 0,
      RETURNED: 0,
      IN_REFILL: 0,
      INSPECTION: 0,
      MAINTENANCE: 0,
      DAMAGED: 0,
      LOST: 0,
      RETIRED: 0,
    };
    cylinderCountsByStatus.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    // Generate last 7 days delivery trend
    const deliveryTrends = await Delivery.aggregate([
      { $match: { scheduledDate: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledDate' } },
          totalScheduled: { $sum: 1 },
          delivered: {
            $sum: { $cond: [{ $eq: ['$deliveryStatus', 'DELIVERED'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Generate last 7 days revenue trend
    const revenueTrends = await Payment.aggregate([
      { $match: { paymentDate: { $gte: sevenDaysAgo }, status: 'COMPLETED' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format inspection pass rates
    const inspMap: Record<string, number> = {};
    inspectionSummary.forEach((item) => {
      inspMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalCylinders,
        availableCylinders: (statusMap.AVAILABLE || 0) + (statusMap.FILLED || 0),
        inCustomerHands: statusMap.DELIVERED || 0,
        inRefill: statusMap.IN_REFILL || 0,
        inInspection: statusMap.INSPECTION || 0,
        inMaintenance: activeMaintenanceCount,
        damagedOrLost: (statusMap.DAMAGED || 0) + (statusMap.LOST || 0) + (statusMap.RETIRED || 0),
        totalCustomers,
        deliveriesToday,
        completedToday,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOutstanding: totalOutstanding[0]?.total || 0,
      },
      cylinderDistribution: [
        { name: 'Available / Filled', value: (statusMap.AVAILABLE || 0) + (statusMap.FILLED || 0), color: '#10b981' },
        { name: 'Delivered', value: statusMap.DELIVERED || 0, color: '#3b82f6' },
        { name: 'Assigned', value: statusMap.ASSIGNED || 0, color: '#6366f1' },
        { name: 'In Refill', value: statusMap.IN_REFILL || 0, color: '#f59e0b' },
        { name: 'Empty / Returned', value: (statusMap.EMPTY || 0) + (statusMap.RETURNED || 0), color: '#8b5cf6' },
        { name: 'Inspection', value: statusMap.INSPECTION || 0, color: '#06b6d4' },
        { name: 'Maintenance', value: statusMap.MAINTENANCE || 0, color: '#ec4899' },
        { name: 'Damaged / Retired', value: (statusMap.DAMAGED || 0) + (statusMap.LOST || 0) + (statusMap.RETIRED || 0), color: '#ef4444' },
      ],
      deliveryTrends,
      revenueTrends,
      inspectionSummary: inspMap,
      recentDeliveries,
      recentAlerts,
    });
  } catch (error) {
    next(error);
  }
};
