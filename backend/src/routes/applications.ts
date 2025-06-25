import { Router } from 'express';
import { protectUserRoute } from '../middleware/authMiddleware';
import {
  submitApplication,
  getUserApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationById,
  withdrawApplication
} from '../controllers/applicationController';

const router = Router();

// User routes (require authentication)
router.post('/', protectUserRoute, submitApplication);
router.get('/my-applications', protectUserRoute, getUserApplications);
router.patch('/:id/withdraw', protectUserRoute, withdrawApplication);

// Admin routes (these would need admin middleware in a real app)
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);

export default router; 