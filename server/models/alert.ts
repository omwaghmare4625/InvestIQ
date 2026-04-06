import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  email: string;
  name: string;
  symbol: string;
  alertType: 'price_above' | 'price_below' | 'percent_change';
  targetValue: number;
  isActive: boolean;
  createdAt: string;
}

const alertSchema = new Schema<IAlert>(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    alertType: {
      type: String,
      enum: ['price_above', 'price_below', 'percent_change'],
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Alert = mongoose.model<IAlert>('alert', alertSchema);
