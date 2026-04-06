import mongoose, { Schema, Document } from 'mongoose';

export interface IHolding {
  symbol: string;
  name: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
  baseCurrency: 'INR' | 'USD';
}

export interface IPortfolio extends Document {
  email: string;
  holdings: IHolding[];
  balance: number;
}

const holdingSchema = new Schema<IHolding>(
  {
    symbol: String,
    name: String,
    qty: Number,
    avgCost: Number,
    currentPrice: Number,
    baseCurrency: {
      type: String,
      enum: ['INR', 'USD'],
      default: 'USD',
    },
  },
  { _id: false }
);

const portfolioSchema = new Schema<IPortfolio>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    holdings: [holdingSchema],
    balance: {
      type: Number,
      default: 50000,
    },
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model<IPortfolio>('portfolio', portfolioSchema);
