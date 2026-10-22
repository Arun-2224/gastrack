import { Response, NextFunction } from 'express';
import { Maintenance } from '../models/Maintenance';
import { Cylinder } from '../models/Cylinder';
import { Location } from '../models/Location';
import { CylinderLifecycleService } from '../services/cylinderLifecycleService';
import { createMaintenanceSchema, updateMaintenanceStatusSchema } from '../validators/schemas';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

export const getMaintenanceJobs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, maintenanceType, technicianId, page = 1, limit = 25 } = req.query;
    const query: any = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (maintenanceType && maintenanceType !== 'ALL') {
      query.maintenanceType = maintenanceType;
    }
    if (technicianId) {
      query.technician = technicianId;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Maintenance.find(query)
        .populate('cylinder', 'cylinderId serialNumber cylinderType capacity status condition')
        .populate('technician', 'name email role phone')
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Maintenance.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: jobs,
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

export const createMaintenanceJob = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createMaintenanceSchema.parse(req.body);

    const cylinder = await Cylinder.findById(data.cylinderId);
    if (!cylinder) {
      res.status(404).json({ success: false, message: 'Cylinder not found' });
      return;
    }

    if (cylinder.status === 'RETIRED') {
      res.status(400).json({ success: false, message: 'Cannot service a RETIRED cylinder.' });
      return;
    }

    const count = await Maintenance.countDocuments();
    const maintenanceId = `MAINT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const maintenanceCenter = await Location.findOne({ type: 'MAINTENANCE_CENTER' });

    const job = await Maintenance.create({
      maintenanceId,
      cylinder: cylinder._id,
      maintenanceType: data.maintenanceType,
      description: data.description,
      technician: data.technicianId,
      startDate: new Date(),
      cost: data.cost || 0,
      status: 'PENDING',
      notes: data.notes,
    });

    // Move cylinder to MAINTENANCE
    await CylinderLifecycleService.transitionStatus({
      cylinderId: cylinder._id,
      newStatus: 'MAINTENANCE',
      userId: req.user!._id as any,
      locationId: maintenanceCenter?._id as any,
      notes: `Sent to maintenance: ${data.maintenanceType} (${data.description})`,
      req,
    });

    await logAudit({
      user: req.user?._id,
      action: 'MAINTENANCE_CREATE',
      entity: 'Maintenance',
      entityId: job.maintenanceId,
      description: `Opened maintenance job ${job.maintenanceId} for cylinder ${cylinder.serialNumber}`,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance ticket opened successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMaintenanceStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateMaintenanceStatusSchema.parse(req.body);

    const job = await Maintenance.findById(id).populate('cylinder');
    if (!job) {
      res.status(404).json({ success: false, message: 'Maintenance job not found' });
      return;
    }

    const prevStatus = job.status;
    job.status = data.status;
    if (data.cost !== undefined) job.cost = data.cost;
    if (data.notes) job.notes = data.notes;

    if (data.status === 'COMPLETED') {
      job.completionDate = new Date();

      const mainWarehouse = await Location.findOne({ type: 'MAIN_WAREHOUSE' });

      // Move cylinder to INSPECTION for post-repair quality assurance
      await CylinderLifecycleService.transitionStatus({
        cylinderId: (job.cylinder as any)._id,
        newStatus: 'INSPECTION',
        newCondition: 'GOOD',
        userId: req.user!._id as any,
        locationId: mainWarehouse?._id as any,
        notes: `Maintenance ${job.maintenanceId} completed. Queued for inspection.`,
        req,
      });
    } else if (data.status === 'CANCELLED') {
      await CylinderLifecycleService.transitionStatus({
        cylinderId: (job.cylinder as any)._id,
        newStatus: 'AVAILABLE',
        userId: req.user!._id as any,
        notes: `Maintenance ${job.maintenanceId} cancelled. Returned to AVAILABLE.`,
        req,
      });
    }

    await job.save();

    await logAudit({
      user: req.user?._id,
      action: 'MAINTENANCE_STATUS_CHANGE',
      entity: 'Maintenance',
      entityId: job.maintenanceId,
      description: `Job ${job.maintenanceId} status changed from ${prevStatus} to ${data.status}`,
      req,
    });

    res.status(200).json({
      success: true,
      message: `Maintenance status updated to ${data.status}`,
      job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update maintenance status',
    });
  }
};

export const getMaintenanceStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [total, byStatus, totalCost] = await Promise.all([
      Maintenance.countDocuments(),
      Maintenance.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Maintenance.aggregate([{ $group: { _id: null, totalCost: { $sum: '$cost' } } }]),
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
        totalCost: totalCost[0]?.totalCost || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
