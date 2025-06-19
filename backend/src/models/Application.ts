import { model, Schema, Document, Types } from 'mongoose';
import { IUser } from './User';
import { IDog } from './Dog';

export interface IApplication extends Document {
  user: Types.ObjectId | IUser;
  dog: Types.ObjectId | IDog;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Withdrawn';
  applicationNotes?: string; // Notes from the applicant
  adminNotes?: string; // Notes from the admin
  submittedAt?: Date;
  updatedAt?: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required.'],
      index: true,
    },
    dog: {
      type: Schema.Types.ObjectId,
      ref: 'Dog',
      required: [true, 'Dog is required.'],
      index: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Withdrawn'],
      default: 'Pending',
      required: true,
    },
    applicationNotes: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

// Compound index to prevent duplicate applications from the same user for the same dog
applicationSchema.index({ user: 1, dog: 1 }, { unique: true });

export const Application = model<IApplication>('Application', applicationSchema); 