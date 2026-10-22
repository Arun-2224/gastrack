import mongoose, { Document, Schema } from 'mongoose';

export interface IRefillPlant extends Document {
  name: string;
  code: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const RefillPlantSchema = new Schema<IRefillPlant>(
  {
    name: {
      type: String,
      required: [true, 'Refill plant name is required'],
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, 'Plant code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    capacity: {
      type: Number,
      default: 500,
      min: 1,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RefillPlant = mongoose.model<IRefillPlant>('RefillPlant', RefillPlantSchema);
