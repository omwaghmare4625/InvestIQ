import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlist extends Document {
  email: string;
  symbols: string[];
}

const watchlistSchema = new Schema<IWatchlist>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    symbols: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Watchlist = mongoose.model<IWatchlist>('watchlist', watchlistSchema);
