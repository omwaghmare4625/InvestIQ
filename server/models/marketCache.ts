import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketCache extends Document {
  symbol: string;
  dataType: 'quote' | 'intraday' | 'daily' | 'indicator';
  email?: string;
  data: Record<string, any>;
  lastUpdated: Date;
  expiresAt: Date;
}

const marketCacheSchema = new Schema<IMarketCache>(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    dataType: {
      type: String,
      enum: ['quote', 'intraday', 'daily', 'indicator'],
      required: true,
    },
    email: {
      type: String,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for symbol + dataType lookups
marketCacheSchema.index({ symbol: 1, dataType: 1 });

export const MarketCache = mongoose.model<IMarketCache>('marketCache', marketCacheSchema);
