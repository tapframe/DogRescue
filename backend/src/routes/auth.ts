import express from 'express';
import { registerAdmin, loginAdmin, verifyAdmin } from '../controllers/authController';
import { protectAdminRoute } from '../middleware/authMiddleware';

const router = express.Router();

// Admin auth routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/verify', protectAdminRoute, verifyAdmin);

export default router; 