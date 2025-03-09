import { Request, Response } from 'express';
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
}

interface JWTPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

const createToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: '24h' // Hardcode to match JWT_EXPIRES_IN from .env
  };
  return jwt.sign(payload, JWT_SECRET as Secret, options);
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Get admin from database
    const admin = await Admin.findOne({ email }) as AdminDocument | null;

    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
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
    res.status(500).json({ error: 'Internal server error' });
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

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
  try {
    const { email, password, username, first_name, last_name, phone_number } = req.body;

    // Validate input
    if (!email || !password || !username) {
      res.status(400).json({ error: 'Email, password, and username are required' });
      return;
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingAdmin) {
      res.status(400).json({ 
        error: existingAdmin.email === email ? 'Email already registered' : 'Username already taken' 
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.id) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Get admin from database
    const admin = await Admin.findOne({ id: user.id }).select('-password') as AdminDocument | null;

    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    res.json({ 
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
