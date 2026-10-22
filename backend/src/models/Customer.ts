import mongoose, { Document, Schema } from 'mongoose';

export type CustomerType = 'HOUSEHOLD' | 'COMMERCIAL' | 'INDUSTRIAL';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface ICustomer extends Document {
  customerId: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  customerType: CustomerType;
  status: CustomerStatus;
  cylinderCount: number;
  outstandingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: 'Metro City',
    },
    state: {
      type: String,
      required: true,
      trim: true,
      default: 'State',
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      default: '560001',
    },
    customerType: {
      type: String,
      enum: ['HOUSEHOLD', 'COMMERCIAL', 'INDUSTRIAL'],
      required: [true, 'Customer type is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
      index: true,
    },
    cylinderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    outstandingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

CustomerSchema.index({ name: 'text', address: 'text' });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
