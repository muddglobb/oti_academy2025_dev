import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getMe
} from '../controllers/user.controller.js';

const router = Router();

// Protect all routes
router.use(authenticateJWT);

// Get all users - Admin only
router.get('/', authorizeRoles('ADMIN'), getAllUsers);

router.get('/me', getMe);

// Get user by ID - Self or Admin
router.get('/:id', getUserById);

// Update user - Self or Admin
router.patch('/:id', updateUser);

// Delete user - Admin only
router.delete('/:id', authorizeRoles('ADMIN'), deleteUser);

export default router;