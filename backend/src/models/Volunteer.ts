import mongoose, { Document, Schema } from 'mongoose';

export interface IVolunteer extends Document {
  name: string;
  email: string;
  phone: string;
  volunteerType: string;
  availability: string;
  experience: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    volunteerType: {
      type: String,
      required: [true, 'Please provide a volunteer type'],
      enum: ['Dog Walker', 'Foster Parent', 'Event Helper', 'Kennel Assistant', 'Other'],
    },
    availability: {
      type: String,
      required: [true, 'Please provide availability'],
      enum: ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'],
    },
    experience: {
      type: String,
      required: [true, 'Please provide experience information'],
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVolunteer>('Volunteer', VolunteerSchema); 