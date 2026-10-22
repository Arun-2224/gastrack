import mongoose, { Document, Schema, Types } from 'mongoose';

export type MaintenanceType =
  | 'VALVE_REPLACEMENT'
  | 'HYDROSTATIC_TEST'
  | 'RE_PAINTING'
  | 'COLLAR_REPAIR'
  | 'FOOT_RING_REPAIR'
  | 'INTERNAL_CLEANING'
  | 'OTHER';

export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface IMaintenance extends Document {
  maintenanceId: string;
  cylinder: Types.ObjectId;
  maintenanceType: MaintenanceType;
  description: string;
  technician: Types.ObjectId;
  startDate: Date;
  completionDate?: Date;
  cost: number;
  status: MaintenanceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceSchema = new Schema<IMaintenance>(
  {
    maintenanceId: {
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
    maintenanceType: {
      type: String,
      enum: [
        'VALVE_REPLACEMENT',
        'HYDROSTATIC_TEST',
        'RE_PAINTING',
        'COLLAR_REPAIR',
        'FOOT_RING_REPAIR',
        'INTERNAL_CLEANING',
        'OTHER',
      ],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    technician: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Technician is required'],
    },
    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completionDate: {
      type: Date,
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, 'Cost cannot be negative'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

MaintenanceSchema.index({ cylinder: 1, status: 1 });
MaintenanceSchema.index({ status: 1, startDate: -1 });

export const Maintenance = mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
