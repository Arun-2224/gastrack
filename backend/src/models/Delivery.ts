import mongoose, { Document, Schema, Types } from 'mongoose';

export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED'
  | 'RESCHEDULED';

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID';

export interface IDelivery extends Document {
  deliveryId: string;
  customer: Types.ObjectId;
  deliveryStaff?: Types.ObjectId;
  scheduledDate: Date;
  deliveryDate?: Date;
  cylinder?: Types.ObjectId;
  quantity: number;
  deliveryAddress: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  paymentAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema<IDelivery>(
  {
    deliveryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required'],
      index: true,
    },
    deliveryStaff: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
      index: true,
    },
    deliveryDate: {
      type: Date,
    },
    cylinder: {
      type: Schema.Types.ObjectId,
      ref: 'Cylinder',
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PARTIAL', 'UNPAID'],
      default: 'UNPAID',
      index: true,
    },
    deliveryStatus: {
      type: String,
      enum: [
        'PENDING',
        'ASSIGNED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'FAILED',
        'CANCELLED',
        'RESCHEDULED',
      ],
      default: 'PENDING',
      index: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
      min: [0, 'Payment amount cannot be negative'],
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

DeliverySchema.index({ deliveryStatus: 1, scheduledDate: -1 });
DeliverySchema.index({ deliveryStaff: 1, deliveryStatus: 1 });
DeliverySchema.index({ customer: 1, createdAt: -1 });

export const Delivery = mongoose.model<IDelivery>('Delivery', DeliverySchema);
