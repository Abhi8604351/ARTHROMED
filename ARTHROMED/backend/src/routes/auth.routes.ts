import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  getMe,
  getAllUsers,
  unlockUser,
  deleteUser
} from '../controllers/auth.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public Authentication
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', requireAuth, getMe);

// Admin-only User Management
router.get('/users', requireAdmin, getAllUsers);
router.post('/users/:id/unlock', requireAdmin, unlockUser);
router.delete('/users/:id', requireAdmin, deleteUser);

export default router;
