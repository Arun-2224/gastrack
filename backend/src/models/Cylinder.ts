import mongoose, { Document, Schema, Types } from 'mongoose';

export type CylinderStatus =
  | 'AVAILABLE'
  | 'FILLED'
  | 'EMPTY'
  | 'ASSIGNED'
  | 'DELIVERED'
  | 'RETURNED'
  | 'IN_REFILL'
  | 'INSPECTION'
  | 'MAINTENANCE'
  | 'DAMAGED'
  | 'LOST'
  | 'RETIRED';

export type CylinderCondition = 'GOOD' | 'FAIR' | 'DAMAGED' | 'CRITICAL' | 'REJECTED';

export type CylinderType = 'DOMESTIC_14_2KG' | 'COMMERCIAL_19KG' | 'INDUSTRIAL_47_5KG' | 'CAMPING_5KG';

export interface ICylinder extends Document {
  cylinderId: string;
  serialNumber: string;
  cylinderType: CylinderType;
  capacity: number;
  brand: string;
  manufacturingDate?: Date;
  purchaseDate?: Date;
  status: CylinderStatus;
  condition: CylinderCondition;
  currentLocation?: Types.ObjectId;
  currentCustomer?: Types.ObjectId | null;
  lastRefillDate?: Date;
  refillCount: number;
  lastInspectionDate?: Date;
  nextInspectionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CylinderSchema = new Schema<ICylinder>(
  {
    cylinderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    cylinderType: {
      type: String,
      enum: ['DOMESTIC_14_2KG', 'COMMERCIAL_19KG', 'INDUSTRIAL_47_5KG', 'CAMPING_5KG'],
      required: true,
      default: 'DOMESTIC_14_2KG',
    },
    capacity: {
      type: Number,
      required: true,
      default: 14.2,
    },
    brand: {
      type: String,
      trim: true,
      default: 'GasTrack SuperGas',
    },
    manufacturingDate: {
      type: Date,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        'AVAILABLE',
        'FILLED',
        'EMPTY',
        'ASSIGNED',
        'DELIVERED',
        'RETURNED',
        'IN_REFILL',
        'INSPECTION',
        'MAINTENANCE',
        'DAMAGED',
        'LOST',
        'RETIRED',
      ],
      default: 'AVAILABLE',
      index: true,
    },
    condition: {
      type: String,
      enum: ['GOOD', 'FAIR', 'DAMAGED', 'CRITICAL', 'REJECTED'],
      default: 'GOOD',
      index: true,
    },
    currentLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      index: true,
    },
    currentCustomer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
      index: true,
    },
    lastRefillDate: {
      type: Date,
    },
    refillCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastInspectionDate: {
      type: Date,
    },
    nextInspectionDate: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

CylinderSchema.index({ status: 1, condition: 1 });
CylinderSchema.index({ currentLocation: 1, status: 1 });
CylinderSchema.index({ serialNumber: 'text', brand: 'text' });

export const Cylinder = mongoose.model<ICylinder>('Cylinder', CylinderSchema);
