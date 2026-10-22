import mongoose, { Document, Schema, Types } from 'mongoose';

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'OTHER';
export type PaymentRecordStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface IPayment extends Document {
  paymentId: string;
  customer: Types.ObjectId;
  delivery?: Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  status: PaymentRecordStatus;
  recordedBy: Types.ObjectId;
  paymentDate: Date;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    delivery: {
      type: Schema.Types.ObjectId,
      ref: 'Delivery',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'OTHER'],
      required: true,
    },
    transactionReference: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'],
      default: 'COMPLETED',
      index: true,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

PaymentSchema.index({ customer: 1, paymentDate: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
