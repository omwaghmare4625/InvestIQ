import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash: string;
  currency: 'INR' | 'USD';
  avatar: string;
  createdAt: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      enum: ['INR', 'USD'],
      default: 'INR',
    },
    avatar: {
      type: String,
      default: '',
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  { timestamps: false }
);

export const User = mongoose.model<IUser>('user', userSchema);
