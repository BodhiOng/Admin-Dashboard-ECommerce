import { Router } from 'express';
import { 
  getAllAdmins, 
  createAdmin, 
  updateAdmin, 
  deleteAdmin,
  validateAdmin
} from '../controllers/adminController';

const router = Router();

// Wrap async handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.route('/')
  .get(asyncHandler(getAllAdmins))
  .post(asyncHandler(createAdmin));

// Validation route
router.route('/validate')
  .post(asyncHandler(validateAdmin));

router.route('/:id')
  .put(asyncHandler(updateAdmin))
  .delete(asyncHandler(deleteAdmin));

export default router;
