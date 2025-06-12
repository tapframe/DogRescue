import mongoose, { Document, Schema } from 'mongoose';

export interface AdoptionApplicationDocument extends Document {
  user: mongoose.Types.ObjectId;
  dog: mongoose.Types.ObjectId;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  applicationDate: Date;
  notes: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  dogName: string;
  reasonForAdoption: string;
  homeType: string;
  hasYard: boolean;
  hasChildren: boolean;
  hasOtherPets: boolean;
  otherPetsDetails: string;
  veterinarianInfo: string;
  updatedAt: Date;
}

const AdoptionApplicationSchema = new Schema<AdoptionApplicationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dog: {
      type: Schema.Types.ObjectId,
      ref: 'Dog',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'approved', 'rejected'],
      default: 'pending',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    dogName: {
      type: String,
      required: true,
    },
    reasonForAdoption: {
      type: String,
      required: true,
    },
    homeType: {
      type: String,
      required: true,
    },
    hasYard: {
      type: Boolean,
      required: true,
    },
    hasChildren: {
      type: Boolean,
      required: true,
    },
    hasOtherPets: {
      type: Boolean,
      required: true,
    },
    otherPetsDetails: {
      type: String,
      default: '',
    },
    veterinarianInfo: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AdoptionApplicationDocument>('AdoptionApplication', AdoptionApplicationSchema); 