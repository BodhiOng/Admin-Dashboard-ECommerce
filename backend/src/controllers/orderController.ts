import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';

// GET /api/orders
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Define allowed page sizes
    const allowedPageSizes = [10, 20, 50];

    // Parse query parameters with type safety and defaults
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search ? (req.query.search as string).trim() : '';
    
    // Define allowed sort fields
    const allowedSortFields = ['id', 'customer', 'date', 'total', 'status'];
    const sortBy = req.query.sortBy && allowedSortFields.includes(req.query.sortBy as string) 
      ? (req.query.sortBy as string).trim() 
      : 'date';
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
        { customer: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch total orders count based on query
    const totalOrders = await Order.countDocuments(query);

    // Fetch paginated and sorted orders
    const orders = await Order.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(validLimit)
      .skip(skipIndex)
      .exec();

    res.status(200).json({
      success: true,
      data: orders,
      error: null,
      pagination: {
        currentPage: validPage,
        pageSize: validLimit,
        totalPages: Math.ceil(totalOrders / validLimit),
        totalOrders,
        hasNextPage: validPage * validLimit < totalOrders,
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

// GET /api/orders/:id
export const getOrderById  = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve the ID from the request parameters
    const { id } = req.params;

    // Find order by ID
    const order = await Order.findOne({ id });

    // If order is not found
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({
      order
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve the ID from the request parameters
    const { id } = req.params;
    // Retrieve the status from the request body
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Status must be one of: Pending, Processing, Completed'
      });
    }

    // Find and update order status
    const updatedOrder = await Order.findOneAndUpdate(
      { id },
      { $set: { status } },
      { new: true }
    );

    // If order is not found
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};
