import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dogrescue_jwt_secret_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Create and sign JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET);
};

interface UserDocument extends IUser {
  _id: any;
}

// @desc    Register new user
// @route   POST /api/auth/user/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, name, email, phone } = req.body;
    
    console.log('User registration attempt:', { username, name, email });

    // Check if user with username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      console.log('User already exists:', { username, email });
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    // Create user
    console.log('Creating new user:', { username, name: name || username, email });
    const user = await User.create({
      username,
      password,
      name: name || username,
      email,
      phone,
      role: 'user',
      status: 'active',
    }) as UserDocument;

    console.log('User created successfully:', user._id);

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/user/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('User login attempt:', { username });

    // Validate input
    if (!username || !password) {
      console.log('Missing credentials:', { username: !!username, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Find user by username and explicitly include password for comparison
    const user = await User.findOne({ username }).select('+password') as UserDocument;
    
    console.log('User found?', !!user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    console.log('Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());
    console.log('Login successful, token generated');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    console.error('User login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Verify user token
// @route   GET /api/auth/user/verify
// @access  Private
export const verifyUser = async (req: Request, res: Response) => {
  try {
    // At this point, the auth middleware has already verified the token
    // and attached the user to the request object
    const user = (req as any).user as UserDocument;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
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