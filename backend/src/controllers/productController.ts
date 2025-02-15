import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/Product';

// GET /api/products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Define allowed page sizes
    const allowedPageSizes = [10, 20, 50];

    // Parse query parameters with type safety and defaults
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search ? (req.query.search as string).trim() : '';
    
    // Define allowed sort fields
    const allowedSortFields = ['id', 'name', 'category', 'price', 'stock', 'createdAt'];
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
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch total products count based on query
    const totalProducts = await Product.countDocuments(query);

    // Fetch paginated and sorted products
    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(validLimit)
      .skip(skipIndex)
      .exec();

    res.status(200).json({
      success: true,
      data: products,
      error: null,
      pagination: {
        currentPage: validPage,
        pageSize: validLimit,
        totalPages: Math.ceil(totalProducts / validLimit),
        totalProducts,
        hasNextPage: validPage * validLimit < totalProducts,
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

// POST /api/products
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve required fields from request body
    const { 
      name, 
      description, 
      price, 
      category, 
      stock, 
      image 
    } = req.body;

    // Validate input data
    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        requiredFields: ['name', 'description', 'price', 'category', 'stock'] 
      });
    }

    // Additional validations (for stock and price)
    if (price < 0) return res.status(400).json({ message: 'Price must be non-negative' });
    if (stock < 0) return res.status(400).json({ message: 'Stock must be non-negative' });

    // Generate UUID for both id and _id
    const productId = "PRODUCT-" + uuidv4();

    // Create new product
    const newProduct = new Product({
      _id: productId,
      id: productId,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      stock: parseInt(stock),
      image: image ? image.trim() : undefined
    });

    // Save product
    await newProduct.save();
    
    // Transform product to include id
    const transformedProduct = {
      ...newProduct.toObject(),
      id: productId,
      _id: productId
    };
    
    res.status(201).json(transformedProduct);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve the ID from the request parameters
    const { id } = req.params;

    // Find and update the product by its ID
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
    // If the product is not found
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    
    res.status(200).json({
      success: true,
      data: updatedProduct,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve the ID from the request parameters
    const { id } = req.params;
    
    // Find and delete the product by its ID
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    // If the product is not found
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    
    res.status(200).json({
      success: true,
      data: deletedProduct,
      error: null
    });
  } catch (error) {
    next(error);
  }
};