import { Router } from 'express';
import { 
  getAllOrders, 
  getOrderById,
  updateOrderStatus 
} from '../controllers/orderController';

const router = Router();

// Wrap async handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.route('/')
  .get(asyncHandler(getAllOrders));

router.route('/:id')
  .get(asyncHandler(getOrderById));

router.route('/:id/status')
  .patch(asyncHandler(updateOrderStatus));

export default router;
