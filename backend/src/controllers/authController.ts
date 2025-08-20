import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Admin, { IAdmin } from '../models/Admin';

// Secret key for accessing admin registration (would be environment variable in real app)
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || '815787';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dogrescue_jwt_secret_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Create and sign JWT token - simpler approach to avoid TypeScript errors
const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET);
};

interface AdminDocument extends IAdmin {
  _id: any;
}

// @desc    Register new admin
// @route   POST /api/auth/admin/register
// @access  Private (requires secret key)
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password, name, email, secretKey } = req.body;
    
    console.log('Registration attempt:', { username, name, email });

    // Verify secret key
    if (secretKey !== ADMIN_SECRET_KEY) {
      console.log('Invalid secret key provided:', secretKey);
      return res.status(401).json({
        success: false,
        message: 'Invalid secret key',
      });
    }

    // Check if admin with username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      console.log('Admin already exists:', { username, email });
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    // Create admin
    console.log('Creating new admin:', { username, name: name || username, email });
    const admin = await Admin.create({
      username,
      password,
      name: name || username,
      email,
      role: 'admin',
      status: 'approved',
    }) as AdminDocument;

    console.log('Admin created successfully:', admin._id);

    // Generate token
    const token = generateToken(admin._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error: any) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });

    // Validate input
    if (!username || !password) {
      console.log('Missing credentials:', { username: !!username, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Find admin by username and explicitly include password for comparison
    const admin = await Admin.findOne({ username }).select('+password') as AdminDocument;
    
    console.log('Admin found?', !!admin);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    console.log('Comparing passwords...');
    const isMatch = await admin.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(admin._id.toString());
    console.log('Login successful, token generated');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Verify admin token
// @route   GET /api/auth/admin/verify
// @access  Private
export const verifyAdmin = async (req: Request, res: Response) => {
  try {
    // At this point, the auth middleware has already verified the token
    // and attached the admin to the request object
    const admin = (req as any).admin as AdminDocument;

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}; 