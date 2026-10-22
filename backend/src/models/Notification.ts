import mongoose, { Document, Schema, Types } from 'mongoose';

export type NotificationType =
  | 'LOW_INVENTORY'
  | 'DELIVERY_DELAY'
  | 'INSPECTION_DUE'
  | 'INSPECTION_OVERDUE'
  | 'REFILL_DELAY'
  | 'MAINTENANCE_DUE'
  | 'PAYMENT_DUE';

export interface INotification extends Document {
  user?: Types.ObjectId | null;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'LOW_INVENTORY',
        'DELIVERY_DELAY',
        'INSPECTION_DUE',
        'INSPECTION_OVERDUE',
        'REFILL_DELAY',
        'MAINTENANCE_DUE',
        'PAYMENT_DUE',
      ],
      required: true,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
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

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
