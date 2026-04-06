import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  email: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  qty: number;
  price: number;
  total: number;
  timestamp: string;
  baseCurrency: 'INR' | 'USD';
}

const transactionSchema = new Schema<ITransaction>(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL'],
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString(),
    },
    baseCurrency: {
      type: String,
      enum: ['INR', 'USD'],
      default: 'USD',
    },
  },
  { timestamps: false }
);

// Compound index for email and timestamp
transactionSchema.index({ email: 1, timestamp: -1 });

export const Transaction = mongoose.model<ITransaction>('transaction', transactionSchema);
