import { Router } from 'express';
import { 
  getAllAdmins, 
  createAdmin, 
  getAdminById, 
  updateAdmin, 
  deleteAdmin
} from '../controllers/adminController';

const router = Router();

// Wrap async handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.route('/')
  .get(asyncHandler(getAllAdmins))
  .post(asyncHandler(createAdmin));

router.route('/:id')
  .get(asyncHandler(getAdminById))
  .put(asyncHandler(updateAdmin))
  .delete(asyncHandler(deleteAdmin));

export default router;
