import express from 'express';
import * as emailController from '../controllers/emailController.js';

const router = express.Router();

/**
 * @route POST /email/password-reset
 * @desc Send password reset email
 * @access Private
 */
router.post('/password-reset', emailController.sendPasswordReset);

/**
 * @route POST /email/payment-confirmation
 * @desc Send payment confirmation email
 * @access Private
 */
router.post('/payment-confirmation', emailController.sendPaymentConfirmation);

/**
 * @route POST /email/enrollment-confirmation
 * @desc Send enrollment confirmation email
 * @access Private
 */
router.post('/enrollment-confirmation', emailController.sendEnrollmentConfirmation);

export default router;
