import express, { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { login, register, me, updateProfile, verifyPassword, validateField } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
    } else {
      callback(new Error('Only image files are allowed'));
    }
  }
});

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/validate-field', validateField);

// Protected routes
router.get('/me', auth, me);
router.post('/verify-password', auth, verifyPassword);
router.put('/me', auth, upload.single('profile_picture'), updateProfile);

export default router;
