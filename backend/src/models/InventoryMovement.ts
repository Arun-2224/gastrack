import mongoose, { Document, Schema, Types } from 'mongoose';

export type MovementType =
  | 'RECEIVED'
  | 'ISSUED'
  | 'DELIVERED'
  | 'RETURNED'
  | 'SENT_FOR_REFILL'
  | 'REFILL_RETURN'
  | 'SENT_FOR_MAINTENANCE'
  | 'MAINTENANCE_RETURN'
  | 'DAMAGED'
  | 'LOST'
  | 'RETIRED';

export interface IInventoryMovement extends Document {
  cylinder: Types.ObjectId;
  movementType: MovementType;
  fromLocation?: Types.ObjectId;
  toLocation?: Types.ObjectId;
  performedBy: Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

const InventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    cylinder: {
      type: Schema.Types.ObjectId,
      ref: 'Cylinder',
      required: true,
      index: true,
    },
    movementType: {
      type: String,
      enum: [
        'RECEIVED',
        'ISSUED',
        'DELIVERED',
        'RETURNED',
        'SENT_FOR_REFILL',
        'REFILL_RETURN',
        'SENT_FOR_MAINTENANCE',
        'MAINTENANCE_RETURN',
        'DAMAGED',
        'LOST',
        'RETIRED',
      ],
      required: true,
      index: true,
    },
    fromLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    toLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

InventoryMovementSchema.index({ cylinder: 1, createdAt: -1 });

export const InventoryMovement = mongoose.model<IInventoryMovement>(
  'InventoryMovement',
  InventoryMovementSchema
);
