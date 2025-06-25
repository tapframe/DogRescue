import { Request, Response } from 'express';
import { Application } from '../models/Application';
import Dog from '../models/Dog';
import User from '../models/User';
import { sendEmail } from '../utils/emailService';

// Define AuthenticatedRequest interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username?: string;
    name?: string;
    email?: string;
  };
}

// Submit adoption application
export const submitApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { dogId, applicationNotes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!dogId) {
      return res.status(400).json({ message: 'Dog ID is required' });
    }

    // Check if dog exists
    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Check if user already has an application for this dog
    const existingApplication = await Application.findOne({
      user: userId,
      dog: dogId
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: 'You have already submitted an application for this dog' 
      });
    }

    // Get user details for email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new application
    const application = new Application({
      user: userId,
      dog: dogId,
      applicationNotes: applicationNotes?.trim(),
      status: 'Pending'
    });

    await application.save();

    // Send confirmation email to the applicant (non-blocking)
    sendEmail(
      user.email,
      'adoptionApplication',
      { 
        name: user.name || user.username,
        dogName: dog.name
      }
    ).catch(error => {
      // Just log the error but don't block the response
      console.error('Failed to send adoption application email:', error);
    });

    // Populate the application with user and dog details for response
    const populatedApplication = await Application.findById(application._id)
      .populate('user', 'firstName lastName email')
      .populate('dog', 'name breed age image');

    res.status(201).json({
      message: 'Application submitted successfully',
      application: populatedApplication
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's applications
export const getUserApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const applications = await Application.find({ user: userId })
      .populate('dog', 'name breed age image')
      .sort({ submittedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all applications (admin only)
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find()
      .populate('user', 'firstName lastName email phone')
      .populate('dog', 'name breed age image')
      .sort({ submittedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update application status (admin only)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Withdrawn'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(id)
      .populate('user')
      .populate('dog');
      
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Store previous status to check if it changed
    const previousStatus = application.status;
    
    // Update application
    application.status = status;
    if (adminNotes) {
      application.adminNotes = adminNotes.trim();
    }

    await application.save();

    // Send email notification if status changed to Approved or Rejected (non-blocking)
    if (previousStatus !== status && (status === 'Approved' || status === 'Rejected')) {
      const user = application.user as any;
      const dog = application.dog as any;
      
      if (user && user.email && dog) {
        sendEmail(
          user.email,
          status === 'Approved' ? 'adoptionApproved' : 'adoptionRejected',
          { 
            name: user.name || user.username || user.firstName,
            dogName: dog.name,
            adminNotes: adminNotes?.trim() || ''
          }
        ).catch(error => {
          // Just log the error but don't block the response
          console.error(`Failed to send adoption ${status} email:`, error);
        });
      }
    }

    const updatedApplication = await Application.findById(application._id)
      .populate('user', 'firstName lastName email phone')
      .populate('dog', 'name breed age image');

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single application by ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('dog', 'name breed age image');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete application (user can withdraw their own application)
export const withdrawApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const application = await Application.findOne({ _id: id, user: userId });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    // Only allow withdrawal if application is still pending or under review
    if (!['Pending', 'Under Review'].includes(application.status)) {
      return res.status(400).json({ 
        message: 'Cannot withdraw application that has already been processed' 
      });
    }

    application.status = 'Withdrawn';
    await application.save();

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 