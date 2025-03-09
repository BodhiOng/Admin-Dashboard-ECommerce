import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import { auth } from './middleware/auth';
import connectDB from './config/database';
import errorHandler from './middleware/errorHandler';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to database
connectDB();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Configure body parser with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/products', auth, productRoutes);
app.use('/api/orders', auth, orderRoutes);
app.use('/api/admins', auth, adminRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    message: 'Backend server is running smoothly' 
  });
});

// Error handling middleware should be after all routes
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
