import emailService from '../services/emailService.js';
import logger from '../utils/logger.js';
import { publishToQueue } from '../services/rabbitmqService.js';

/**
 * Send a password reset email
 */
export const sendPasswordReset = async (req, res) => {
  const { email, resetLink, username } = req.body;

  try {
    if (!email || !resetLink || !username) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Publish to RabbitMQ queue instead of direct email sending
    await publishToQueue({
      type: 'password-reset',
      data: { email, resetLink, username }
    });
    
    res.status(202).json({
      success: true,
      message: 'Password reset email request accepted and queued',
    });
  } catch (error) {
    logger.error('Error queuing password reset email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to queue password reset email',
      error: error.message,
    });
  }
};

/**
 * Send a payment confirmation email
 */
export const sendPaymentConfirmation = async (req, res) => {
  const { email, username, courseName, amount, transactionId, date } = req.body;

  try {
    if (!email || !username || !courseName || !amount || !transactionId || !date) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Publish to RabbitMQ queue instead of direct email sending
    await publishToQueue({
      type: 'payment-confirmation',
      data: { email, username, courseName, amount, transactionId, date }
    });
    
    res.status(202).json({
      success: true,
      message: 'Payment confirmation email request accepted and queued',
    });
  } catch (error) {
    logger.error('Error queuing payment confirmation email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to queue payment confirmation email',
      error: error.message,
    });
  }
};

/**
 * Send an enrollment confirmation email
 */
export const sendEnrollmentConfirmation = async (req, res) => {
  const { email, username, courseName, startDate, courseLink } = req.body;

  try {
    if (!email || !username || !courseName || !startDate || !courseLink) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Publish to RabbitMQ queue instead of direct email sending
    await publishToQueue({
      type: 'enrollment-confirmation',
      data: { email, username, courseName, startDate, courseLink }
    });
    
    res.status(202).json({
      success: true,
      message: 'Enrollment confirmation email request accepted and queued',
    });
  } catch (error) {
    logger.error('Error queuing enrollment confirmation email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to queue enrollment confirmation email',
      error: error.message,
    });
  }
};
