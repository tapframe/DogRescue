import express from 'express';
import { 
  submitApplication, 
  getUserApplications, 
  getAllApplications, 
  updateApplicationStatus,
  getApplicationById
} from '../controllers/adoptionController';
import { protectUserRoute } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = express.Router();

// User routes
router.post('/', protectUserRoute, submitApplication);
router.get('/user', protectUserRoute, getUserApplications);
router.get('/:id', protectUserRoute, getApplicationById);

// Admin routes
router.get('/', protectUserRoute, adminOnly, getAllApplications);
router.put('/:id', protectUserRoute, adminOnly, updateApplicationStatus);

export default router; 