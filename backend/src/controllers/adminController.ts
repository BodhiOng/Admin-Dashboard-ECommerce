import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Admin from '../models/Admin';
import bcrypt from 'bcrypt';

// GET /api/admins
export const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Define allowed page sizes
    const allowedPageSizes = [10, 20, 50];

    // Parse query parameters with type safety and defaults
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search ? (req.query.search as string).trim() : '';
    
    // Define allowed sort fields
    const allowedSortFields = ['id', 'username', 'email', 'role', 'createdAt'];
    const sortBy = req.query.sortBy && allowedSortFields.includes(req.query.sortBy as string) 
      ? (req.query.sortBy as string).trim() 
      : 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Validate page and limit
    const validPage = page > 0 ? page : 1;
    const validLimit = allowedPageSizes.includes(limit) ? limit : 10;
    const skipIndex = (validPage - 1) * validLimit;

    // Build dynamic query
    const query: any = {};
    if (search) {
      query.$or = [
        { id: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch total admins count based on query
    const totalAdmins = await Admin.countDocuments(query);

    // Fetch paginated and sorted admins (exclude password)
    const admins = await Admin.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder })
      .limit(validLimit)
      .skip(skipIndex)
      .exec();

    res.status(200).json({
      success: true,
      data: admins,
      pagination: {
        currentPage: validPage,
        pageSize: validLimit,
        totalPages: Math.ceil(totalAdmins / validLimit),
        totalAdmins,
        hasNextPage: validPage * validLimit < totalAdmins,
        hasPreviousPage: validPage > 1
      },
      query: {
        search,
        sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc'
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admins
export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve required fields from request body
    const { 
      username, 
      email, 
      password,
      phone_number,
      first_name,
      last_name,
      address,
      role,
      profile_picture
    } = req.body;

    // Validate input data
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ 
        message: 'Missing required fields', 
        requiredFields: ['username', 'email', 'password'] 
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingAdmin) {
      console.log('Admin already exists:', { username, email });
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate UUID for both id and _id
    const adminId = "ADMIN-" + uuidv4();

    // Create new admin
    const newAdmin = new Admin({
      _id: adminId,
      id: adminId,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone_number: phone_number?.trim() || '',
      first_name: first_name?.trim() || '',
      last_name: last_name?.trim() || '',
      address: address?.trim() || '',
      role: role?.trim() || 'Current Admin',
      profile_picture: profile_picture?.trim() || ''
    });

    // Save admin
    await newAdmin.save();
        
    // Transform admin to include id and exclude password
    const transformedAdmin = {
      ...newAdmin.toObject(),
      id: adminId,
      _id: adminId,
      password: undefined
    };
    
    res.status(201).json({
      success: true,
      data: transformedAdmin
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admins/:id
export const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve the ID from the request parameters
    const { id } = req.params;

    // Extract fields that can be updated
    const { 
      username, 
      phone_number,
      first_name,
      last_name,
      address,
      role,
      profile_picture
    } = req.body;

    // Check if password is being updated
    if (req.body.password) {
      // Hash new password
      const saltRounds = 12;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    // Find and update the admin by its ID
    const updatedAdmin = await Admin.findOneAndUpdate(
      { id }, 
      { 
        $set: {
          ...req.body,
          ...(username && { username: username.trim() }),
          ...(phone_number && { phone_number: phone_number.trim() }),
          ...(first_name && { first_name: first_name.trim() }),
          ...(last_name && { last_name: last_name.trim() }),
          ...(address && { address: address.trim() }),
          ...(role && { role: role.trim() }),
          ...(profile_picture && { profile_picture: profile_picture.trim() })
        }
      }, 
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');
    
    // If the admin is not found
    if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });
    
    res.status(200).json({
      success: true,
      data: updatedAdmin
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admins/validate
export const validateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, phone_number } = req.body;
    const errors: { [key: string]: string } = {};

    // Check username availability
    if (username) {
      const existingUsername = await Admin.findOne({ username });
      if (existingUsername) {
        errors.username = 'Username is already taken';
      }
    }

    // Check email availability
    if (email) {
      const existingEmail = await Admin.findOne({ email });
      if (existingEmail) {
        errors.email = 'Email is already registered';
      }
    }

    // Check phone number availability
    if (phone_number) {
      const existingPhoneNumber = await Admin.findOne({ phone_number });
      if (existingPhoneNumber) {
        errors.phone_number = 'Phone number is already registered';
      }
    }

    // Return validation results
    res.status(200).json({
      success: Object.keys(errors).length === 0,
      errors
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admins/:id
export const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve the ID from the request parameters
    const { id } = req.params;
    
    // Find and delete the admin by its ID
    const deletedAdmin = await Admin.findOneAndDelete({ id }).select('-password');
    
    // If the admin is not found
    if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });
    
    res.status(200).json({
      success: true,
      data: deletedAdmin
    });
  } catch (error) {
    next(error);
  }
};
