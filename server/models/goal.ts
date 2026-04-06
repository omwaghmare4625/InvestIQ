import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  monthlyContribution: number;
  icon: string;
  baseCurrency: 'INR' | 'USD';
}

export interface IGoalDoc extends Document {
  email: string;
  goals: IGoal[];
}

const goalSchema = new Schema<IGoal>(
  {
    id: String,
    title: String,
    target: Number,
    current: Number,
    monthlyContribution: Number,
    icon: String,
    baseCurrency: {
      type: String,
      enum: ['INR', 'USD'],
      default: 'USD',
    },
  },
  { _id: false }
);

const goalDocSchema = new Schema<IGoalDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    goals: [goalSchema],
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoalDoc>('goal', goalDocSchema);
