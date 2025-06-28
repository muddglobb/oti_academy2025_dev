import express from 'express';
import { 
  validateInviteEmails,
  createGroupPayment,
  getGroupPayments,
  getGroupPaymentById,
  approveGroupPayment,
  deleteGroupPayment
} from '../controllers/group-payment.controller.js';
import { authenticate, permit } from '../utils/rbac/index.js';

const router = express.Router();

// Validate emails sebelum create payment (accessible by authenticated users)
router.post('/validate-emails', authenticate, validateInviteEmails);

// Create group payment (authenticated users only - returns courseName instead of packageInfo)
router.post('/', authenticate, createGroupPayment);

// Get group payment by ID (accessible by payment owner or admin - returns courseName instead of packageInfo)
router.get('/:id', authenticate, getGroupPaymentById);

// Get all group payments (admin only - returns courseName instead of packageInfo)
router.get('/', authenticate, permit('ADMIN'), getGroupPayments);

// Approve group payment (admin only)
router.patch('/:id/approve', authenticate, permit('ADMIN'), approveGroupPayment);

// Delete group payment (admin only)
router.delete('/:id', authenticate, permit('ADMIN'), deleteGroupPayment);

export default router;
