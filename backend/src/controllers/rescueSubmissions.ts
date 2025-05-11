import { Request, Response } from 'express';
import RescueSubmission from '../models/RescueSubmission';

// @desc    Get all rescue submissions
// @route   GET /api/rescue-submissions
// @access  Private
export const getRescueSubmissions = async (req: Request, res: Response) => {
  try {
    const rescueSubmissions = await RescueSubmission.find().sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: rescueSubmissions.length,
      data: rescueSubmissions
    });
  } catch (error) {
    console.error('Error fetching rescue submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single rescue submission
// @route   GET /api/rescue-submissions/:id
// @access  Private
export const getRescueSubmission = async (req: Request, res: Response) => {
  try {
    const rescueSubmission = await RescueSubmission.findById(req.params.id);
    
    if (!rescueSubmission) {
      return res.status(404).json({
        success: false,
        error: 'Rescue submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rescueSubmission
    });
  } catch (error) {
    console.error('Error fetching rescue submission:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new rescue submission
// @route   POST /api/rescue-submissions
// @access  Public
export const createRescueSubmission = async (req: Request, res: Response) => {
  try {
    const rescueSubmission = await RescueSubmission.create(req.body);
    
    res.status(201).json({
      success: true,
      data: rescueSubmission
    });
  } catch (error: any) {
    console.error('Error creating rescue submission:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update rescue submission
// @route   PUT /api/rescue-submissions/:id
// @access  Private
export const updateRescueSubmission = async (req: Request, res: Response) => {
  try {
    let rescueSubmission = await RescueSubmission.findById(req.params.id);
    
    if (!rescueSubmission) {
      return res.status(404).json({
        success: false,
        error: 'Rescue submission not found'
      });
    }
    
    rescueSubmission = await RescueSubmission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: rescueSubmission
    });
  } catch (error: any) {
    console.error('Error updating rescue submission:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete rescue submission
// @route   DELETE /api/rescue-submissions/:id
// @access  Private
export const deleteRescueSubmission = async (req: Request, res: Response) => {
  try {
    const rescueSubmission = await RescueSubmission.findById(req.params.id);
    
    if (!rescueSubmission) {
      return res.status(404).json({
        success: false,
        error: 'Rescue submission not found'
      });
    }
    
    await RescueSubmission.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting rescue submission:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 