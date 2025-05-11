import mongoose, { Document, Schema } from 'mongoose';

export interface IDog extends Document {
  name: string;
  breed: string;
  age: string;
  size: string;
  gender: string;
  image: string;
  description: string;
  tags: string[];
  rescueId?: string;  // Reference to the rescue submission ID if this dog was rescued
  status?: string;    // To track if the dog is available, adopted, etc.
  createdAt: Date;
  updatedAt: Date;
}

const DogSchema = new Schema<IDog>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, 'Please provide a breed'],
      trim: true,
    },
    age: {
      type: String,
      required: [true, 'Please provide an age'],
      trim: true,
    },
    size: {
      type: String,
      required: [true, 'Please provide a size'],
      enum: ['Small', 'Medium', 'Large'],
    },
    gender: {
      type: String,
      required: [true, 'Please provide a gender'],
      enum: ['Male', 'Female'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    tags: {
      type: [String],
      default: [],
    },
    rescueId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['available', 'adopted', 'fostered', 'pending'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDog>('Dog', DogSchema); 