import { Response, NextFunction } from 'express';
import { Cylinder, CylinderStatus, CylinderCondition } from '../models/Cylinder';
import { CylinderStatusHistory } from '../models/CylinderStatusHistory';
import { InventoryMovement } from '../models/InventoryMovement';
import { Location } from '../models/Location';
import { CylinderLifecycleService } from '../services/cylinderLifecycleService';
import { createCylinderSchema, updateCylinderStatusSchema } from '../validators/schemas';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

export const getCylinders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 25,
      search,
      status,
      condition,
      cylinderType,
      locationId,
      customerId,
    } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { serialNumber: { $regex: search, $options: 'i' } },
        { cylinderId: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (condition && condition !== 'ALL') {
      query.condition = condition;
    }

    if (cylinderType && cylinderType !== 'ALL') {
      query.cylinderType = cylinderType;
    }

    if (locationId) {
      query.currentLocation = locationId;
    }

    if (customerId) {
      query.currentCustomer = customerId;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const [cylinders, total] = await Promise.all([
      Cylinder.find(query)
        .populate('currentLocation', 'name type')
        .populate('currentCustomer', 'customerId name phone customerType')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Cylinder.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: cylinders,
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

export const getCylinderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const cylinder = await Cylinder.findById(id)
      .populate('currentLocation', 'name type address')
      .populate('currentCustomer', 'customerId name phone email address customerType');

    if (!cylinder) {
      res.status(404).json({ success: false, message: 'Cylinder not found' });
      return;
    }

    res.status(200).json({ success: true, cylinder });
  } catch (error) {
    next(error);
  }
};

export const getCylinderHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const history = await CylinderStatusHistory.find({ cylinder: id })
      .populate('changedBy', 'name role email')
      .populate('location', 'name type')
      .sort({ timestamp: -1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

export const getCylinderMovements = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const movements = await InventoryMovement.find({ cylinder: id })
      .populate('fromLocation', 'name type')
      .populate('toLocation', 'name type')
      .populate('performedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, movements });
  } catch (error) {
    next(error);
  }
};

export const getCylinderStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [statusStats, conditionStats, typeStats, totalCount] = await Promise.all([
      Cylinder.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Cylinder.aggregate([{ $group: { _id: '$condition', count: { $sum: 1 } } }]),
      Cylinder.aggregate([{ $group: { _id: '$cylinderType', count: { $sum: 1 } } }]),
      Cylinder.countDocuments(),
    ]);

    const statusMap: Record<string, number> = {};
    statusStats.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    const conditionMap: Record<string, number> = {};
    conditionStats.forEach((item) => {
      conditionMap[item._id] = item.count;
    });

    const typeMap: Record<string, number> = {};
    typeStats.forEach((item) => {
      typeMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        byStatus: statusMap,
        byCondition: conditionMap,
        byType: typeMap,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCylinder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createCylinderSchema.parse(req.body);

    // Enforce business rule: Duplicate serial numbers must be rejected
    const existing = await Cylinder.findOne({ serialNumber: data.serialNumber });
    if (existing) {
      res.status(409).json({
        success: false,
        message: `A cylinder with serial number '${data.serialNumber}' already exists.`,
      });
      return;
    }

    // Generate unique cylinderId
    const count = await Cylinder.countDocuments();
    const cylinderId = `CYL-${String(count + 1).padStart(4, '0')}`;

    // Default location to Main Warehouse if not provided
    let locationId = data.currentLocation;
    if (!locationId) {
      const defaultLoc = await Location.findOne({ type: 'MAIN_WAREHOUSE' });
      if (defaultLoc) locationId = defaultLoc._id as any;
    }

    const cylinder = await Cylinder.create({
      cylinderId,
      serialNumber: data.serialNumber,
      cylinderType: data.cylinderType,
      capacity: data.capacity,
      brand: data.brand,
      manufacturingDate: data.manufacturingDate ? new Date(data.manufacturingDate) : undefined,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
      status: data.status,
      condition: data.condition,
      currentLocation: locationId,
      refillCount: 0,
      nextInspectionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months default
    });

    // Record initial status history
    await CylinderStatusHistory.create({
      cylinder: cylinder._id,
      newStatus: cylinder.status,
      changedBy: req.user?._id,
      location: cylinder.currentLocation,
      notes: 'Initial inventory registration',
      timestamp: new Date(),
    });

    // Record initial inventory movement
    await InventoryMovement.create({
      cylinder: cylinder._id,
      movementType: 'RECEIVED',
      toLocation: cylinder.currentLocation,
      performedBy: req.user?._id,
      notes: 'Received into inventory',
      createdAt: new Date(),
    });

    // Audit log
    await logAudit({
      user: req.user?._id,
      action: 'CYLINDER_CREATE',
      entity: 'Cylinder',
      entityId: cylinder.serialNumber,
      description: `Registered new cylinder ${cylinder.serialNumber} (${cylinder.cylinderId})`,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Cylinder created successfully',
      cylinder,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCylinder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { brand, capacity, condition, nextInspectionDate } = req.body;

    const cylinder = await Cylinder.findById(id);
    if (!cylinder) {
      res.status(404).json({ success: false, message: 'Cylinder not found' });
      return;
    }

    if (brand) cylinder.brand = brand;
    if (capacity) cylinder.capacity = capacity;
    if (condition) cylinder.condition = condition;
    if (nextInspectionDate) cylinder.nextInspectionDate = new Date(nextInspectionDate);

    await cylinder.save();

    await logAudit({
      user: req.user?._id,
      action: 'CYLINDER_UPDATE',
      entity: 'Cylinder',
      entityId: cylinder.serialNumber,
      description: `Updated cylinder details for ${cylinder.serialNumber}`,
      req,
    });

    res.status(200).json({ success: true, cylinder });
  } catch (error) {
    next(error);
  }
};

export const transitionStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = updateCylinderStatusSchema.parse(req.body);

    const updatedCylinder = await CylinderLifecycleService.transitionStatus({
      cylinderId: id,
      newStatus: data.status,
      newCondition: data.condition,
      userId: req.user!._id as any,
      locationId: data.locationId,
      customerId: data.customerId,
      notes: data.notes,
      req,
    });

    res.status(200).json({
      success: true,
      message: `Cylinder status updated to ${data.status}`,
      cylinder: updatedCylinder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update cylinder status',
    });
  }
};

export const bulkTransition = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cylinderIds, newStatus, locationId, notes } = req.body;

    if (!Array.isArray(cylinderIds) || cylinderIds.length === 0) {
      res.status(400).json({ success: false, message: 'At least one cylinder must be provided' });
      return;
    }

    const results = [];
    const errors = [];

    for (const id of cylinderIds) {
      try {
        const updated = await CylinderLifecycleService.transitionStatus({
          cylinderId: id,
          newStatus,
          userId: req.user!._id as any,
          locationId,
          notes,
          req,
        });
        results.push(updated);
      } catch (err: any) {
        errors.push({ id, error: err.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed ${results.length} cylinders successfully. ${errors.length} failed.`,
      successful: results.length,
      failed: errors.length,
      errors,
    });
  } catch (error) {
    next(error);
  }
};
