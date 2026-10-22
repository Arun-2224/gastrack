import mongoose, { Document, Schema, Types } from 'mongoose';
import { CylinderStatus } from './Cylinder';

export interface ICylinderStatusHistory extends Document {
  cylinder: Types.ObjectId;
  previousStatus?: CylinderStatus;
  newStatus: CylinderStatus;
  changedBy: Types.ObjectId;
  location?: Types.ObjectId;
  notes?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CylinderStatusHistorySchema = new Schema<ICylinderStatusHistory>(
  {
    cylinder: {
      type: Schema.Types.ObjectId,
      ref: 'Cylinder',
      required: true,
      index: true,
    },
    previousStatus: {
      type: String,
      trim: true,
    },
    newStatus: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    notes: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

CylinderStatusHistorySchema.index({ cylinder: 1, timestamp: -1 });

export const CylinderStatusHistory = mongoose.model<ICylinderStatusHistory>(
  'CylinderStatusHistory',
  CylinderStatusHistorySchema
);
