import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Validate and set allowed page sizes
    const allowedPageSizes = [10, 20, 50];
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Ensure limit is one of the allowed sizes
    const validLimit = allowedPageSizes.includes(limit) ? limit : 10;
    const skipIndex = (page - 1) * validLimit;

    // Fetch total products count
    const totalProducts = await Product.countDocuments();

    // Fetch paginated products
    const products = await Product.find()
      .limit(validLimit)
      .skip(skipIndex)
      .exec();

    res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        pageSize: validLimit,
        totalPages: Math.ceil(totalProducts / validLimit),
        totalProducts
      },
      allowedPageSizes
    });
  } catch (error) {
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
