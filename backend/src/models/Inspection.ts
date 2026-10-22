import mongoose, { Document, Schema, Types } from 'mongoose';

export type InspectionResult = 'PASSED' | 'FAILED' | 'NEEDS_MAINTENANCE' | 'REJECTED';

export interface IInspection extends Document {
  inspectionId: string;
  cylinder: Types.ObjectId;
  inspector: Types.ObjectId;
  inspectionDate: Date;
  inspectionType: 'ROUTINE' | 'POST_REFILL' | 'PERIODIC_STATUTORY' | 'INCIDENT_CHECK';
  leakTest: 'PASSED' | 'FAILED';
  valveCondition: 'GOOD' | 'FAIR' | 'DEFECTIVE';
  bodyCondition: 'GOOD' | 'DENTED' | 'CORRODED' | 'DAMAGED';
  corrosion: 'NONE' | 'SURFACE' | 'SEVERE';
  pressureTest: 'PASSED' | 'FAILED' | 'NOT_APPLICABLE';
  safetySeal: 'INTACT' | 'BROKEN' | 'MISSING';
  overallCondition: 'GOOD' | 'FAIR' | 'POOR' | 'REJECTED';
  result: InspectionResult;
  remarks?: string;
  nextInspectionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InspectionSchema = new Schema<IInspection>(
  {
    inspectionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    cylinder: {
      type: Schema.Types.ObjectId,
      ref: 'Cylinder',
      required: [true, 'Cylinder is required'],
      index: true,
    },
    inspector: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Inspector is required'],
    },
    inspectionDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    inspectionType: {
      type: String,
      enum: ['ROUTINE', 'POST_REFILL', 'PERIODIC_STATUTORY', 'INCIDENT_CHECK'],
      default: 'POST_REFILL',
    },
    leakTest: {
      type: String,
      enum: ['PASSED', 'FAILED'],
      required: true,
    },
    valveCondition: {
      type: String,
      enum: ['GOOD', 'FAIR', 'DEFECTIVE'],
      required: true,
    },
    bodyCondition: {
      type: String,
      enum: ['GOOD', 'DENTED', 'CORRODED', 'DAMAGED'],
      required: true,
    },
    corrosion: {
      type: String,
      enum: ['NONE', 'SURFACE', 'SEVERE'],
      default: 'NONE',
    },
    pressureTest: {
      type: String,
      enum: ['PASSED', 'FAILED', 'NOT_APPLICABLE'],
      default: 'PASSED',
    },
    safetySeal: {
      type: String,
      enum: ['INTACT', 'BROKEN', 'MISSING'],
      default: 'INTACT',
    },
    overallCondition: {
      type: String,
      enum: ['GOOD', 'FAIR', 'POOR', 'REJECTED'],
      required: true,
    },
    result: {
      type: String,
      enum: ['PASSED', 'FAILED', 'NEEDS_MAINTENANCE', 'REJECTED'],
      required: true,
      index: true,
    },
    remarks: {
      type: String,
      trim: true,
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

InspectionSchema.index({ cylinder: 1, inspectionDate: -1 });
InspectionSchema.index({ result: 1, nextInspectionDate: 1 });

export const Inspection = mongoose.model<IInspection>('Inspection', InspectionSchema);
