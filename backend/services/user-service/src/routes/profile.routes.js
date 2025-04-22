import { Router } from 'express';
import { 
  getProfileById, 
  getAllProfiles, 
  updateProfile,
  initializeProfile,
  updateLastLogin
} from '../controllers/profile.controller.js';
import { 
  validateUpdateProfile,
  validateProfileId
} from '../validators/profile.validator.js';

import { verifyServiceApiKey } from '../middlewares/service-auth.middleware.js';

import { authenticate, permit, permitSelfOrAdmin } from '../../../../libs/index.js';

const router = Router();

// Public routes - None

// Protected routes - need authentication
router.get('/:id', authenticate, permitSelfOrAdmin, validateProfileId, getProfileById);
router.put('/:id', authenticate, permitSelfOrAdmin, validateProfileId, validateUpdateProfile, updateProfile);

// Admin-only routes
router.get('/', authenticate, permit('ADMIN'), getAllProfiles);

// Internal routes for service-to-service communication
// These could be secured with API keys or other methods
router.post('/', verifyServiceApiKey, initializeProfile); // Called by Auth Service after registration
router.put('/:id/login', verifyServiceApiKey, validateProfileId, updateLastLogin); // Called by Auth Service after login

export default router;