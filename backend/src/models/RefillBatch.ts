import mongoose, { Document, Schema, Types } from 'mongoose';

export type RefillBatchStatus =
  | 'CREATED'
  | 'SENT'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'QUALITY_CHECK'
  | 'APPROVED'
  | 'REJECTED';

export interface IRefillBatch extends Document {
  batchId: string;
  refillPlant: Types.ObjectId;
  cylinders: Types.ObjectId[];
  createdDate: Date;
  startDate?: Date;
  expectedCompletionDate?: Date;
  completionDate?: Date;
  status: RefillBatchStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefillBatchSchema = new Schema<IRefillBatch>(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    refillPlant: {
      type: Schema.Types.ObjectId,
      ref: 'RefillPlant',
      required: [true, 'Refill plant is required'],
      index: true,
    },
    cylinders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Cylinder',
      },
    ],
    createdDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    startDate: {
      type: Date,
    },
    expectedCompletionDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['CREATED', 'SENT', 'IN_PROGRESS', 'COMPLETED', 'QUALITY_CHECK', 'APPROVED', 'REJECTED'],
      default: 'CREATED',
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

RefillBatchSchema.index({ status: 1, createdDate: -1 });

export const RefillBatch = mongoose.model<IRefillBatch>('RefillBatch', RefillBatchSchema);
