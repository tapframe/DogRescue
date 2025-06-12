import express from 'express';
import { registerAdmin, loginAdmin, verifyAdmin } from '../controllers/authController';
import { registerUser, loginUser, verifyUser } from '../controllers/userController';
import { protectAdminRoute, protectUserRoute } from '../middleware/authMiddleware';

const router = express.Router();

// Admin auth routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/verify', protectAdminRoute, verifyAdmin);

// User auth routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/verify', protectUserRoute, verifyUser);

export default router; 