import mongoose from 'mongoose';

const rescueSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  breed: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Please provide the gender'],
    enum: ['Male', 'Female', 'Unknown']
  },
  age: {
    type: String,
    required: [true, 'Please provide the approximate age']
  },
  size: {
    type: String,
    required: [true, 'Please provide the size']
  },
  location: {
    type: String,
    required: [true, 'Please provide the location where found']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  contactName: {
    type: String,
    required: [true, 'Please provide contact name']
  },
  contactEmail: {
    type: String,
    required: [true, 'Please provide contact email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  contactPhone: {
    type: String,
    required: [true, 'Please provide contact phone number']
  },
  imageUrls: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'rescued', 'closed'],
    default: 'pending'
  },
  statusNotes: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  // User information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String
  },
  userEmail: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('RescueSubmission', rescueSubmissionSchema); 