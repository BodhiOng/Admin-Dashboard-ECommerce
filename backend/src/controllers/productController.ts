import { Request, Response } from 'express';
import Product from '../models/Product';

// Example usages on client-side:
// GET products?page=2&limit=20
// GET products?search=electronics
// GET products?sortBy=price&sortOrder=asc
// GET products?search=phone&sortBy=stock&sortOrder=desc&page=1&limit=10
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Define allowed page sizes
    const allowedPageSizes = [10, 20, 50, 100];

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
      products,
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
      allowedPageSizes,
      allowedSortFields
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error });
  }
};
