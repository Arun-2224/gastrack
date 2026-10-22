import { Response, NextFunction } from 'express';
import { RefillPlant } from '../models/RefillPlant';
import { RefillBatch, RefillBatchStatus } from '../models/RefillBatch';
import { Cylinder } from '../models/Cylinder';
import { Location } from '../models/Location';
import { CylinderLifecycleService } from '../services/cylinderLifecycleService';
import {
  createRefillPlantSchema,
  createRefillBatchSchema,
  updateRefillBatchStatusSchema,
} from '../validators/schemas';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

export const getRefillPlants = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plants = await RefillPlant.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: plants.length, plants });
  } catch (error) {
    next(error);
  }
};

export const createRefillPlant = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createRefillPlantSchema.parse(req.body);
    const plant = await RefillPlant.create(data);

    // Also register a Location for this plant if not existing
    const existingLoc = await Location.findOne({ name: plant.name });
    if (!existingLoc) {
      await Location.create({
        name: `${plant.name} Site`,
        type: 'REFILL_PLANT',
        address: plant.address,
        status: 'ACTIVE',
      });
    }

    await logAudit({
      user: req.user?._id,
      action: 'REFILL_PLANT_CREATE',
      entity: 'RefillPlant',
      entityId: plant.code,
      description: `Created refill plant ${plant.name} (${plant.code})`,
      req,
    });

    res.status(201).json({ success: true, plant });
  } catch (error) {
    next(error);
  }
};

export const getRefillBatches = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, plantId, page = 1, limit = 25 } = req.query;
    const query: any = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (plantId) {
      query.refillPlant = plantId;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const [batches, total] = await Promise.all([
      RefillBatch.find(query)
        .populate('refillPlant', 'name code address capacity')
        .populate('cylinders', 'cylinderId serialNumber capacity cylinderType status condition')
        .sort({ createdDate: -1 })
        .skip(skip)
        .limit(limitNum),
      RefillBatch.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: batches,
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

export const getRefillBatchById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const batch = await RefillBatch.findById(id)
      .populate('refillPlant')
      .populate('cylinders');

    if (!batch) {
      res.status(404).json({ success: false, message: 'Refill batch not found' });
      return;
    }

    res.status(200).json({ success: true, batch });
  } catch (error) {
    next(error);
  }
};

export const createRefillBatch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createRefillBatchSchema.parse(req.body);

    const plant = await RefillPlant.findById(data.refillPlantId);
    if (!plant) {
      res.status(404).json({ success: false, message: 'Refill plant not found' });
      return;
    }

    const count = await RefillBatch.countDocuments();
    const batchId = `BATCH-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const batch = await RefillBatch.create({
      batchId,
      refillPlant: plant._id,
      cylinders: data.cylinderIds,
      createdDate: new Date(),
      expectedCompletionDate: data.expectedCompletionDate ? new Date(data.expectedCompletionDate) : undefined,
      status: 'SENT',
      startDate: new Date(),
      notes: data.notes,
    });

    // Find the plant location
    const plantLoc = await Location.findOne({ type: 'REFILL_PLANT' });

    // Transition all cylinders in batch to IN_REFILL
    for (const cylId of data.cylinderIds) {
      await CylinderLifecycleService.transitionStatus({
        cylinderId: cylId,
        newStatus: 'IN_REFILL',
        userId: req.user!._id as any,
        locationId: plantLoc?._id as any,
        notes: `Dispatched in refill batch ${batch.batchId} to plant ${plant.name}`,
        req,
      });
    }

    await logAudit({
      user: req.user?._id,
      action: 'REFILL_BATCH_CREATE',
      entity: 'RefillBatch',
      entityId: batch.batchId,
      description: `Dispatched refill batch ${batch.batchId} with ${data.cylinderIds.length} cylinders to ${plant.name}`,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Refill batch created and dispatched',
      batch,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRefillBatchStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateRefillBatchStatusSchema.parse(req.body);

    const batch = await RefillBatch.findById(id).populate('refillPlant');
    if (!batch) {
      res.status(404).json({ success: false, message: 'Refill batch not found' });
      return;
    }

    const prevStatus = batch.status;
    batch.status = data.status as RefillBatchStatus;
    if (data.notes) batch.notes = data.notes;

    if (data.status === 'COMPLETED' || data.status === 'APPROVED') {
      batch.completionDate = new Date();

      const mainWarehouse = await Location.findOne({ type: 'MAIN_WAREHOUSE' });

      // Move cylinders into INSPECTION phase
      for (const cylId of batch.cylinders) {
        await CylinderLifecycleService.transitionStatus({
          cylinderId: cylId as any,
          newStatus: 'INSPECTION',
          userId: req.user!._id as any,
          locationId: mainWarehouse?._id as any,
          notes: `Batch ${batch.batchId} refilled and returned for safety inspection.`,
          req,
        });
      }
    } else if (data.status === 'REJECTED') {
      for (const cylId of batch.cylinders) {
        await CylinderLifecycleService.transitionStatus({
          cylinderId: cylId as any,
          newStatus: 'DAMAGED',
          newCondition: 'DAMAGED',
          userId: req.user!._id as any,
          notes: `Batch ${batch.batchId} rejected by quality check at plant.`,
          req,
        });
      }
    }

    await batch.save();

    await logAudit({
      user: req.user?._id,
      action: 'REFILL_BATCH_STATUS',
      entity: 'RefillBatch',
      entityId: batch.batchId,
      description: `Batch ${batch.batchId} status updated from ${prevStatus} to ${data.status}`,
      req,
    });

    res.status(200).json({
      success: true,
      message: `Batch status updated to ${data.status}`,
      batch,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update refill batch status',
    });
  }
};
