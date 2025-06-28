import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getMe,
  getUserByEmail,
  getBatchUsers
} from '../controllers/user.controller.js';

const router = Router();

// Protect all routes
router.use(authenticateJWT);

// Get multiple users by IDs - Service only (for batch operations like group payments)
router.get('/', (req, res, next) => {
  // If query has 'ids' parameter, route to getBatchUsers
  if (req.query.ids) {
    return getBatchUsers(req, res, next);
  }
  // Otherwise, route to getAllUsers
  return getAllUsers(req, res, next);
});

// Get user by email - Service only (for group payment validation)
router.get('/by-email/:email', authorizeRoles('SERVICE'), getUserByEmail);

router.get('/me', getMe);

// Get user by ID - Self or Admin
router.get('/:id', getUserById);

// Update user - Self or Admin
router.patch('/:id', updateUser);

// Delete user - Admin only
router.delete('/:id', authorizeRoles('ADMIN'), deleteUser);

export default router;