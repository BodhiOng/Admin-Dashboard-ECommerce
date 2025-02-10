import { Router } from 'express';
import { 
  getAllProducts, 
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct
} from '../controllers/productController';

const router = Router();

// Wrap async handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.route('/')
  .get(asyncHandler(getAllProducts))
  .post(asyncHandler(createProduct));

router.route('/:id')
  .get(asyncHandler(getProductById))
  .put(asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

export default router;
