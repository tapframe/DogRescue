import { Request, Response } from 'express';
import AdoptionApplication from '../models/AdoptionApplication';
import Dog from '../models/Dog';
import User from '../models/User';
import mongoose from 'mongoose';

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

// @desc    Submit a new adoption application
// @route   POST /api/adoptions
// @access  Private (requires user auth)
export const submitApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      dog, dogId, // Accept either dog or dogId
      reasonForAdoption,
      homeType,
      hasYard,
      hasChildren,
      hasOtherPets,
      otherPetsDetails,
      veterinarianInfo,
      userPhone
    } = req.body;

    const dogIdToUse = dog || dogId; // Use whichever is provided

    // Validate required fields
    if (!dogIdToUse || !reasonForAdoption || !homeType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required information'
      });
    }

    // Get user from req.user (set by auth middleware)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Check if dog exists
    const dogRecord = await Dog.findById(dogIdToUse);
    if (!dogRecord) {
      return res.status(404).json({
        success: false,
        message: 'Dog not found'
      });
    }

    // Check if user already has an application for this dog
    const existingApplication = await AdoptionApplication.findOne({
      user: userId,
      dog: dogIdToUse
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have an application for this dog',
        applicationId: existingApplication._id
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create new application
    const application = new AdoptionApplication({
      user: userId,
      dog: dogIdToUse,
      dogName: dogRecord.name,
      userName: user.name,
      userEmail: user.email,
      userPhone: userPhone || user.phone || 'Not provided',
      reasonForAdoption,
      homeType,
      hasYard,
      hasChildren,
      hasOtherPets,
      otherPetsDetails: otherPetsDetails || '',
      veterinarianInfo: veterinarianInfo || '',
    });

    await application.save();

    res.status(201).json({
      success: true,
      application,
      message: 'Adoption application submitted successfully'
    });
  } catch (error: any) {
    console.error('Error submitting adoption application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all adoption applications for a user
// @route   GET /api/adoptions/user
// @access  Private (requires user auth)
export const getUserApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const applications = await AdoptionApplication.find({ user: userId })
      .populate('dog', 'name breed age gender image')
      .sort({ applicationDate: -1 });

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error: any) {
    console.error('Error getting user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all adoption applications (admin only)
// @route   GET /api/adoptions
// @access  Private (admin only)
export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    const applications = await AdoptionApplication.find()
      .populate('user', 'name email')
      .populate('dog', 'name breed age gender image')
      .sort({ applicationDate: -1 });

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error: any) {
    console.error('Error getting all applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update adoption application status (admin only)
// @route   PUT /api/adoptions/:id
// @access  Private (admin only)
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update application status'
      });
    }

    // Validate status
    if (!['pending', 'reviewing', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Find and update the application
    const application = await AdoptionApplication.findByIdAndUpdate(
      id,
      { 
        status,
        notes: notes || '',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      application,
      message: `Application status updated to ${status}`
    });
  } catch (error: any) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get a single adoption application
// @route   GET /api/adoptions/:id
// @access  Private (user or admin)
export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID'
      });
    }

    const application = await AdoptionApplication.findById(id)
      .populate('dog', 'name breed age gender image')
      .populate('user', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to view this application
    if (
      req.user?.role !== 'admin' && 
      application.user._id.toString() !== req.user?.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error: any) {
    console.error('Error getting application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 