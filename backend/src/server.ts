import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productRoutes from './routes/productRoutes';
import connectDB from './config/database';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to database
connectDB();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    message: 'Backend server is running smoothly' 
  });
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation Error',
      errors: err.message
    });
    return;
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    res.status(409).json({
      message: 'Duplicate Entry',
      field: Object.keys(err.keyPattern)[0]
    });
    return;
  }

  // Handle cast errors (invalid ID format)
  if (err.name === 'CastError') {
    res.status(400).json({
      message: 'Invalid ID format',
      field: err.path
    });
    return;
  }

  // Default error response
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
