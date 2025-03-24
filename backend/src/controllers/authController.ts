import { Request, Response, NextFunction } from 'express';
import type { Multer } from 'multer';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret, JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config';
import Admin, { IAdmin } from '../models/Admin';
import { v4 as uuidv4 } from 'uuid';

interface LoginBody {
  email: string;
  password: string;
}

interface AdminDocument extends IAdmin {
  toObject(): Record<string, any>;
  password: string;
}

interface JWTPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

interface UpdateProfileBody {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface UpdateProfileData extends UpdateProfileBody {
  password?: string;
  profile_picture?: string;
}

// Extend Express Request to include Multer file
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  body: UpdateProfileBody;
}

const createToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: '24h' // Hardcode to match JWT_EXPIRES_IN from .env
  };
  return jwt.sign(payload, JWT_SECRET as Secret, options);
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.name = 'ValidationError';
      return next(error);
    }

    // Get admin from database
    const admin = await Admin.findOne({ email }) as AdminDocument | null;

    if (!admin) {
      const error = new Error('Invalid credentials');
      error.name = 'UnauthorizedError';
      return next(error);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.name = 'UnauthorizedError';
      return next(error);
    }

    // Generate JWT token
    const payload: JWTPayload = { 
      id: admin.id,
      email: admin.email,
      role: admin.role,
      iat: Math.floor(Date.now() / 1000)
    };
    const token = createToken(payload);

    // Remove password from admin object
    const adminObject = admin.toObject();
    adminObject.password = undefined;

    res.json({
      user: adminObject,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

interface RegisterBody {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, username, first_name, last_name, phone_number } = req.body;

    // Validate input
    if (!email || !password || !username) {
      const error = new Error('Email, password, and username are required');
      error.name = 'ValidationError';
      return next(error);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingAdmin) {
      const errorMessage = existingAdmin.email === email ? 'Email already registered' : 'Username already taken';
      const error = new Error(errorMessage);
      error.name = 'DuplicateEntryError';
      return next(error);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const id = uuidv4();
    const admin = await Admin.create({
      _id: id,
      id,
      email,
      password: hashedPassword,
      username,
      first_name: first_name || '',
      last_name: last_name || '',
      phone_number: phone_number || '',
      role: 'Current Admin'
    }) as AdminDocument;

    // Generate JWT token
    const payload: JWTPayload = { 
      id: admin.id,
      email: admin.email,
      role: admin.role,
      iat: Math.floor(Date.now() / 1000)
    };
    const token = createToken(payload);

    // Remove password from admin object
    const adminObject = admin.toObject();
    adminObject.password = undefined;

    res.status(201).json({
      user: adminObject,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.id) {
      const error = new Error('Authentication required');
      error.name = 'UnauthorizedError';
      return next(error);
    }

    // Get admin from database
    const admin = await Admin.findOne({ id: user.id }).select('-password') as AdminDocument | null;

    if (!admin) {
      const error = new Error('Admin not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    res.json({ 
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get me error:', error);
    next(error);
  }
};

export const updateProfile = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.id) {
      const error = new Error('Authentication required');
      error.name = 'UnauthorizedError';
      return next(error);
    }

    // Get admin from database
    const admin = await Admin.findOne({ id: user.id }) as AdminDocument | null;

    if (!admin) {
      const error = new Error('Admin not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    const { currentPassword, newPassword, ...updateData } = req.body;
    const profileUpdate: UpdateProfileData = { ...updateData };

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        const error = new Error('Current password is required to change password');
        error.name = 'ValidationError';
        return next(error);
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
      if (!isValidPassword) {
        const error = new Error('Current password is incorrect');
        error.name = 'UnauthorizedError';
        return next(error);
      }

      // Validate new password
      if (newPassword.length < 8) {
        const error = new Error('New password must be at least 8 characters long');
        error.name = 'ValidationError';
        return next(error);
      }

      // Hash new password
      profileUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    // Handle file upload if present
    if (req.file) {
      // Convert file to base64
      const base64Image = req.file.buffer.toString('base64');
      profileUpdate.profile_picture = base64Image;
    }

    // Update admin profile
    const updatedAdmin = await Admin.findOneAndUpdate(
      { id: user.id },
      { $set: profileUpdate },
      { new: true }
    ).select('-password') as AdminDocument | null;

    if (!updatedAdmin) {
      const error = new Error('Admin not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    res.json({
      success: true,
      data: updatedAdmin
    });
  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

export const verifyPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.id) {
      const error = new Error('Authentication required');
      error.name = 'UnauthorizedError';
      return next(error);
    }

    const { password } = req.body;

    if (!password) {
      const error = new Error('Password is required');
      error.name = 'ValidationError';
      return next(error);
    }

    // Get admin from database
    const admin = await Admin.findOne({ id: user.id }) as AdminDocument | null;

    if (!admin) {
      const error = new Error('Admin not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    res.json({
      success: true,
      data: {
        valid: isValidPassword
      }
    });
  } catch (error) {
    console.error('Verify password error:', error);
    next(error);
  }
};
