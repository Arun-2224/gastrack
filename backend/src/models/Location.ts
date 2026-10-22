import mongoose, { Document, Schema } from 'mongoose';

export type LocationType = 
  | 'MAIN_WAREHOUSE' 
  | 'SECONDARY_WAREHOUSE' 
  | 'DELIVERY_VEHICLE' 
  | 'CUSTOMER_SITE' 
  | 'REFILL_PLANT' 
  | 'MAINTENANCE_CENTER' 
  | 'OTHER';

export interface ILocation extends Document {
  name: string;
  type: LocationType;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      unique: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'MAIN_WAREHOUSE',
        'SECONDARY_WAREHOUSE',
        'DELIVERY_VEHICLE',
        'CUSTOMER_SITE',
        'REFILL_PLANT',
        'MAINTENANCE_CENTER',
        'OTHER',
      ],
      required: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
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

export const Location = mongoose.model<ILocation>('Location', LocationSchema);
