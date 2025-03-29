import { Request, Response, NextFunction, RequestHandler } from 'express';
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

interface ValidateFieldBody {
  field: 'email' | 'username' | 'phone_number';
  value: string;
}

const createToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: '24h' // Hardcode to match JWT_EXPIRES_IN from .env
  };
  return jwt.sign(payload, JWT_SECRET as Secret, options);
};

export const login: RequestHandler<{}, {}, LoginBody> = async (req, res, next) => {
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

    // Check if user is an admin applicant
    if (admin.role === 'Admin Applicant') {
      res.json({
        success: true,
        data: {
          isApplicant: true,
          message: 'Your application is still under review'
        }
      });
      return;
    }

    // Generate JWT token for approved admins
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
      success: true,
      data: {
        isApplicant: false,
        user: adminObject,
        token
      }
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
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const register = async (req: Request<{}, any, RegisterBody>, res: Response, next: NextFunction) => {
  try {
    const { email, password, username, firstName, lastName, phoneNumber } = req.body;

    // Validate input
    if (!email || !password || !username) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Email, password, and username are required',
          type: 'ValidationError',
          errors: {
            email: !email ? 'Email is required' : '',
            password: !password ? 'Password is required' : '',
            username: !username ? 'Username is required' : ''
          }
        }
      });
      return;
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { username }, { phone_number: phoneNumber }] 
    });

    if (existingAdmin) {
      const errors: { [key: string]: string } = {};
      
      if (existingAdmin.email === email) {
        errors.email = 'Email already registered';
      }
      if (existingAdmin.username === username) {
        errors.username = 'Username already taken';
      } 
      if (existingAdmin.phone_number === phoneNumber) {
        errors.phoneNumber = 'Phone number already registered';
      }

      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          type: 'ValidationError',
          errors
        }
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const id = uuidv4();
    const admin = await Admin.create({
      _id: id,
      id,
      username,
      email,
      phone_number: phoneNumber || '',  
      role: 'Admin Applicant',
      first_name: firstName || '',      
      last_name: lastName || '',        
      password: hashedPassword,
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

    res.json({
      success: true,
      data: {
        user: adminObject,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        type: 'ServerError'
      }
    });
  }
};

export const me: RequestHandler = async (req, res, next) => {
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

export const updateProfile: RequestHandler<{}, {}, UpdateProfileBody> = async (req, res, next) => {
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

export const verifyPassword: RequestHandler<{}, {}, { password: string }> = async (req, res, next) => {
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

export const validateField: RequestHandler = async (req, res) => {
  try {
    const { field, value } = req.body;

    if (!field || !value || !['email', 'username', 'phone_number'].includes(field)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid field or value'
        }
      });
    }

    // Create query based on field
    const query = { [field]: value };
    
    // Check if admin exists with this field value
    const existingAdmin = await Admin.findOne(query);

    if (existingAdmin) {
      res.status(200).json({
        success: false,
        error: {
          message: `This ${field.replace('_', ' ')} is already taken`
        }
      });
    } else {
      res.status(200).json({
        success: true,
        message: `${field.replace('_', ' ')} is available`
      });
    }
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
};
