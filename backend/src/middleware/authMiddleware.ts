import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import User from '../models/User';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dogrescue_jwt_secret_2024';

interface JwtPayload {
  id: string;
}

export const protectAdminRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided',
      });
    }

    try {
      // Verify token - simplified to avoid TypeScript errors
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      console.log('Token verified, decoded:', decoded);

      // Find admin by id
      const admin = await Admin.findById(decoded.id);
      console.log('Admin found?', !!admin);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found',
        });
      }

      // Attach admin to request object
      (req as any).admin = admin;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const protectUserRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      console.log('User token verified, decoded:', decoded);

      // Find user by id
      const user = await User.findById(decoded.id);
      console.log('User found?', !!user);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found',
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Account is inactive. Please contact support.',
        });
      }

      // Attach user to request object
      (req as any).user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}; 