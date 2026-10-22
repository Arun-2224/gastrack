import mongoose, { Types } from 'mongoose';
import { Cylinder, CylinderStatus, CylinderCondition, ICylinder } from '../models/Cylinder';
import { CylinderStatusHistory } from '../models/CylinderStatusHistory';
import { InventoryMovement, MovementType } from '../models/InventoryMovement';
import { logAudit } from '../utils/audit';

export interface TransitionParams {
  cylinderId: string | Types.ObjectId;
  newStatus: CylinderStatus;
  newCondition?: CylinderCondition;
  userId: Types.ObjectId | string;
  locationId?: Types.ObjectId | string;
  customerId?: Types.ObjectId | string | null;
  notes?: string;
  movementType?: MovementType;
  req?: any;
}

export class CylinderLifecycleService {
  /**
   * Determine corresponding inventory movement type based on status transition
   */
  private static getMovementType(fromStatus: CylinderStatus, toStatus: CylinderStatus): MovementType {
    if (toStatus === 'DELIVERED') return 'DELIVERED';
    if (toStatus === 'RETURNED' || toStatus === 'EMPTY') return 'RETURNED';
    if (toStatus === 'IN_REFILL') return 'SENT_FOR_REFILL';
    if (fromStatus === 'IN_REFILL' && (toStatus === 'FILLED' || toStatus === 'AVAILABLE' || toStatus === 'INSPECTION')) return 'REFILL_RETURN';
    if (toStatus === 'MAINTENANCE') return 'SENT_FOR_MAINTENANCE';
    if (fromStatus === 'MAINTENANCE' && (toStatus === 'AVAILABLE' || toStatus === 'INSPECTION')) return 'MAINTENANCE_RETURN';
    if (toStatus === 'DAMAGED') return 'DAMAGED';
    if (toStatus === 'LOST') return 'LOST';
    if (toStatus === 'RETIRED') return 'RETIRED';
    if (toStatus === 'ASSIGNED') return 'ISSUED';
    return 'RECEIVED';
  }

  /**
   * Enforce business logic rules on state transitions
   */
  public static validateTransition(cylinder: ICylinder, newStatus: CylinderStatus, newCondition?: CylinderCondition): void {
    const currentStatus = cylinder.status;
    const condition = newCondition || cylinder.condition;

    // Rule 1: RETIRED cylinders cannot be reused or reactivated
    if (currentStatus === 'RETIRED' && newStatus !== 'RETIRED') {
      throw new Error('RETIRED cylinders cannot be reused or reactivated.');
    }

    // Rule 2: LOST cylinders cannot be delivered or assigned without recovery
    if (currentStatus === 'LOST' && (newStatus === 'DELIVERED' || newStatus === 'ASSIGNED')) {
      throw new Error('LOST cylinders cannot be assigned or delivered without first being recovered and inspected.');
    }

    // Rule 3: DAMAGED cylinders cannot be delivered
    if (newStatus === 'DELIVERED' && (condition === 'DAMAGED' || condition === 'CRITICAL' || condition === 'REJECTED')) {
      throw new Error(`Cannot deliver cylinder with condition '${condition}'. It must undergo maintenance or replacement.`);
    }

    // Rule 4: Cylinders under maintenance cannot be assigned or delivered
    if (currentStatus === 'MAINTENANCE' && (newStatus === 'ASSIGNED' || newStatus === 'DELIVERED')) {
      throw new Error('Cylinders currently under maintenance cannot be assigned or delivered.');
    }

    // Rule 5: Cannot assign if status is not AVAILABLE or FILLED
    if (newStatus === 'ASSIGNED' && currentStatus !== 'AVAILABLE' && currentStatus !== 'FILLED') {
      throw new Error(`Only AVAILABLE or FILLED cylinders can be assigned. Current status is '${currentStatus}'.`);
    }

    // Rule 6: Cannot deliver if not ASSIGNED or AVAILABLE
    if (newStatus === 'DELIVERED' && currentStatus !== 'ASSIGNED' && currentStatus !== 'AVAILABLE') {
      throw new Error(`Cylinder must be ASSIGNED or AVAILABLE to be delivered. Current status is '${currentStatus}'.`);
    }
  }

  /**
   * Transition a cylinder to a new status with full history, inventory movement, and audit log
   */
  public static async transitionStatus(params: TransitionParams): Promise<ICylinder> {
    const cylinder = await Cylinder.findById(params.cylinderId);
    if (!cylinder) {
      throw new Error(`Cylinder not found: ${params.cylinderId}`);
    }

    const previousStatus = cylinder.status;
    const fromLocation = cylinder.currentLocation;

    // Validate the proposed transition
    this.validateTransition(cylinder, params.newStatus, params.newCondition);

    // Apply updates to cylinder
    cylinder.status = params.newStatus;
    if (params.newCondition) {
      cylinder.condition = params.newCondition;
    }
    if (params.locationId) {
      cylinder.currentLocation = new mongoose.Types.ObjectId(params.locationId as string);
    }
    if (params.customerId !== undefined) {
      cylinder.currentCustomer = params.customerId 
        ? new mongoose.Types.ObjectId(params.customerId as string) 
        : null;
    }

    // Special lifecycle counter updates
    if (previousStatus === 'IN_REFILL' && (params.newStatus === 'FILLED' || params.newStatus === 'AVAILABLE')) {
      cylinder.refillCount = (cylinder.refillCount || 0) + 1;
      cylinder.lastRefillDate = new Date();
    }

    if (params.newStatus === 'RETURNED' || params.newStatus === 'EMPTY') {
      // Cylinder is back at company; customer is cleared
      cylinder.currentCustomer = null;
    }

    await cylinder.save();

    // 1. Record Cylinder Status History
    await CylinderStatusHistory.create({
      cylinder: cylinder._id,
      previousStatus,
      newStatus: params.newStatus,
      changedBy: new mongoose.Types.ObjectId(params.userId as string),
      location: cylinder.currentLocation,
      notes: params.notes || `Status changed from ${previousStatus} to ${params.newStatus}`,
      timestamp: new Date(),
    });

    // 2. Record Inventory Movement
    const movementType = params.movementType || this.getMovementType(previousStatus, params.newStatus);
    await InventoryMovement.create({
      cylinder: cylinder._id,
      movementType,
      fromLocation,
      toLocation: cylinder.currentLocation,
      performedBy: new mongoose.Types.ObjectId(params.userId as string),
      notes: params.notes || `Movement recorded for status transition to ${params.newStatus}`,
      createdAt: new Date(),
    });

    // 3. Record Audit Log
    await logAudit({
      user: params.userId,
      action: 'CYLINDER_STATUS_CHANGE',
      entity: 'Cylinder',
      entityId: cylinder.serialNumber,
      description: `Transitioned cylinder ${cylinder.serialNumber} (${cylinder.cylinderId}) from ${previousStatus} to ${params.newStatus}`,
      req: params.req,
    });

    return cylinder;
  }
}
