import { Response, NextFunction } from 'express';
import { Inspection, InspectionResult } from '../models/Inspection';
import { Cylinder, CylinderCondition, CylinderStatus } from '../models/Cylinder';
import { CylinderLifecycleService } from '../services/cylinderLifecycleService';
import { createInspectionSchema } from '../validators/schemas';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

export const getInspections = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { result, inspectionType, cylinderId, page = 1, limit = 25 } = req.query;
    const query: any = {};

    if (result && result !== 'ALL') {
      query.result = result;
    }
    if (inspectionType && inspectionType !== 'ALL') {
      query.inspectionType = inspectionType;
    }
    if (cylinderId) {
      query.cylinder = cylinderId;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const [inspections, total] = await Promise.all([
      Inspection.find(query)
        .populate('cylinder', 'cylinderId serialNumber cylinderType capacity status condition')
        .populate('inspector', 'name role email')
        .sort({ inspectionDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Inspection.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: inspections,
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

export const createInspection = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createInspectionSchema.parse(req.body);

    const cylinder = await Cylinder.findById(data.cylinderId);
    if (!cylinder) {
      res.status(404).json({ success: false, message: 'Cylinder not found' });
      return;
    }

    const count = await Inspection.countDocuments();
    const inspectionId = `INSP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const nextDate = data.nextInspectionDate
      ? new Date(data.nextInspectionDate)
      : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 180 days

    const inspection = await Inspection.create({
      inspectionId,
      cylinder: cylinder._id,
      inspector: req.user!._id,
      inspectionDate: new Date(),
      inspectionType: data.inspectionType,
      leakTest: data.leakTest,
      valveCondition: data.valveCondition,
      bodyCondition: data.bodyCondition,
      corrosion: data.corrosion,
      pressureTest: data.pressureTest,
      safetySeal: data.safetySeal,
      overallCondition: data.overallCondition,
      result: data.result,
      remarks: data.remarks,
      nextInspectionDate: nextDate,
    });

    // Enforce business rules based on inspection result:
    let newStatus: CylinderStatus;
    let newCondition: CylinderCondition;

    if (data.result === 'PASSED') {
      newStatus = 'AVAILABLE';
      newCondition = 'GOOD';
      cylinder.lastInspectionDate = new Date();
      cylinder.nextInspectionDate = nextDate;
      await cylinder.save();
    } else if (data.result === 'NEEDS_MAINTENANCE') {
      newStatus = 'MAINTENANCE';
      newCondition = 'FAIR';
    } else if (data.result === 'FAILED') {
      newStatus = 'DAMAGED';
      newCondition = 'DAMAGED';
    } else {
      // REJECTED
      newStatus = 'RETIRED';
      newCondition = 'REJECTED';
    }

    // Transition cylinder lifecycle
    await CylinderLifecycleService.transitionStatus({
      cylinderId: cylinder._id,
      newStatus,
      newCondition,
      userId: req.user!._id as any,
      notes: `Inspection ${inspection.inspectionId} result: ${data.result}. Remarks: ${data.remarks || 'None'}`,
      req,
    });

    await logAudit({
      user: req.user?._id,
      action: 'INSPECTION_COMPLETE',
      entity: 'Inspection',
      entityId: inspection.inspectionId,
      description: `Completed inspection ${inspection.inspectionId} for cylinder ${cylinder.serialNumber}. Result: ${data.result}`,
      req,
    });

    res.status(201).json({
      success: true,
      message: `Inspection recorded successfully. Result: ${data.result}`,
      inspection,
    });
  } catch (error) {
    next(error);
  }
};

export const getInspectionStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [total, byResult] = await Promise.all([
      Inspection.countDocuments(),
      Inspection.aggregate([{ $group: { _id: '$result', count: { $sum: 1 } } }]),
    ]);

    const resultMap: Record<string, number> = {};
    byResult.forEach((item) => {
      resultMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        byResult: resultMap,
      },
    });
  } catch (error) {
    next(error);
  }
};
