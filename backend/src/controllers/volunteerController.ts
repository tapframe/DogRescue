import { Request, Response } from 'express';
import Volunteer from '../models/Volunteer';
import { sendEmail } from '../utils/emailService';

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private (would require auth in production)
export const getVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteers = await Volunteer.find().sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get single volunteer
// @route   GET /api/volunteers/:id
// @access  Private (would require auth in production)
export const getVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      res.status(404).json({
        success: false,
        error: 'Volunteer not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Create new volunteer application
// @route   POST /api/volunteers
// @access  Public
export const createVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.create(req.body);

    // Send confirmation email to the volunteer (non-blocking)
    sendEmail(
      volunteer.email,
      'volunteerApplication',
      { name: volunteer.name }
    ).catch(error => {
      // Just log the error but don't block the response
      console.error('Failed to send volunteer application email:', error);
    });

    res.status(201).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(val => (val as any).message);
      
      res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
};

// @desc    Update volunteer
// @route   PUT /api/volunteers/:id
// @access  Private (would require auth in production)
export const updateVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      res.status(404).json({
        success: false,
        error: 'Volunteer not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(val => (val as any).message);
      
      res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
};

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private (would require auth in production)
export const deleteVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      res.status(404).json({
        success: false,
        error: 'Volunteer not found',
      });
      return;
    }

    await volunteer.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update volunteer status
// @route   PATCH /api/volunteers/:id/status
// @access  Private (would require auth in production)
export const updateVolunteerStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid status (pending, approved, rejected)',
      });
      return;
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      res.status(404).json({
        success: false,
        error: 'Volunteer not found',
      });
      return;
    }

    // Send email based on status update (non-blocking)
    if (status === 'approved' || status === 'rejected') {
      sendEmail(
        volunteer.email,
        status === 'approved' ? 'volunteerApproved' : 'volunteerRejected',
        { 
          name: volunteer.name,
          volunteerType: volunteer.volunteerType
        }
      ).catch(error => {
        // Just log the error but don't block the response
        console.error(`Failed to send volunteer ${status} email:`, error);
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
}; 