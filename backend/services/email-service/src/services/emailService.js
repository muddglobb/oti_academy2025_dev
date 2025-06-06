import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Email Service for OmahTI Academy
 * Handles sending transactional emails using HTML templates
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.templatesBasePath = '';
    this.from = '"OmahTI Academy 2025" <noreply@academy.omahti.web.id>';
    this.needsReconnect = false;
    this.setupTransporter();
  }
  // Setup simple SMTP transporter (no OAuth2)
  async setupTransporter() {
    try {
      // Create simple SMTP transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD // App Password
        },
        // Increase timeout for connections
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
      });
      
      logger.info('SMTP transporter set up successfully');
    } catch (error) {
      logger.error(`Error setting up SMTP transporter: ${error.message}`);
      // Don't throw here, we'll handle it in verification
    }
    
    // Use more flexible path resolution for templates
    // Check if we're in development or development mode
    if (process.env.NODE_ENV === 'development') {
      // In development, templates are in src/templates
      this.templatesBasePath = path.join(__dirname, '..', 'templates');
    } else {
      // In development/Docker, templates should be in src/templates
      this.templatesBasePath = path.join(process.cwd(), 'src', 'templates');
    }
    
    logger.info(`Templates path set to: ${this.templatesBasePath}`);
    this.from = '"OmahTI Academy 2025" <noreply@academy.omahti.web.id>';

    // Verify connection
    this.verifyConnection();
  }

  /**
   * Verify connection to email server
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('SMTP connection established successfully');
      this.needsReconnect = false;
    } catch (error) {
      logger.error('Failed to establish connection to SMTP server:', error.message);
      // Don't crash the service, we'll retry later
      logger.info('Will retry connection on first email send attempt');
      // If we can't verify, we'll set up a retry mechanism
      this.needsReconnect = true;
    }
  }

  /**
   * Reconnect to email server if needed
   */
  async reconnectIfNeeded() {
    if (this.needsReconnect) {
      logger.info('Trying to reconnect to SMTP server before sending email');
      await this.setupTransporter();
    }
  }

  /**
   * Load and process HTML template
   * 
   * @param {string} templateName Template name (folder name)
   * @param {Object} variables Variables to replace in template
   * @returns {Promise<string>} Processed HTML content
   */
  async loadTemplate(templateName, variables = {}) {
    try {
      const templatePath = path.join(this.templatesBasePath, templateName, 'index.html');
      logger.info(`Attempting to load template from: ${templatePath}`);
      
      let htmlContent = await fs.readFile(templatePath, 'utf8');
      
      // Replace variables in template
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        htmlContent = htmlContent.replace(regex, variables[key]);
      });
      
      return htmlContent;
    } catch (error) {
      logger.error(`Error loading template ${templateName}:`, error.message);
      throw new Error(`Template ${templateName} not found or could not be loaded`);
    }
  }

  /**
   * Send an email using a template
   * 
   * @param {Object} options Email options including recipient, subject, template name, and variables
   * @returns {Promise<void>} Promise that resolves when the email is sent
   */
  async sendEmail(options) {
    try {
      // Reconnect if needed
      await this.reconnectIfNeeded();

      const { to, subject, templateName, variables } = options;
      
      // Load and process template
      const htmlContent = await this.loadTemplate(templateName, variables);
      
      // Email options
      const mailOptions = {
        from: this.from,
        to,
        subject,
        html: htmlContent,
      };
      
      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}. MessageId: ${result.messageId}`);
      
      return result;
    } catch (error) {
      logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send a password reset email
   * 
   * @param {string} to Recipient email address
   * @param {string} resetLink Link to reset password
   * @param {string} username User's name
   */
  async sendPasswordResetEmail(to, resetLink, username) {
    return await this.sendEmail({
      to,
      subject: 'Reset Your OmahTI Academy Password',
      templateName: 'password-reset',
      variables: {
        username,
        resetLink,
        currentYear: new Date().getFullYear().toString(),
      },
    });
  }

  /**
   * Send a payment confirmation email
   * 
   * @param {string} to Recipient email address
   * @param {string} username User's name
   * @param {string} courseName Name of the course
   * @param {string} amount Payment amount
   * @param {string} transactionId Transaction ID
   * @param {string} date Payment date
   */
  async sendPaymentConfirmationEmail(to, username, courseName, amount, transactionId, date) {
    return await this.sendEmail({
      to,
      subject: 'Payment Confirmation - OmahTI Academy',
      templateName: 'payment-confirmation',
      variables: {
        username,
        courseName,
        amount,
        transactionId,
        date,
        currentYear: new Date().getFullYear().toString(),
      },
    });
  }
  /**
   * Send an enrollment confirmation email
   * 
   * @param {string} to Recipient email address
   * @param {string} username User's name
   * @param {string} courseName Name of the course
   * @param {string} startDate Course start date
   * @param {string} courseLink Link to course
   */
  async sendEnrollmentConfirmationEmail(to, username, courseName, startDate, courseLink) {
    return await this.sendEmail({
      to,
      subject: 'Enrollment Confirmation - OmahTI Academy',
      templateName: 'enrollment-confirmation',
      variables: {
        username,
        courseName,
        startDate,
        courseLink,
        currentYear: new Date().getFullYear().toString(),
      },
    });
  }
}

// Export singleton instance
export default new EmailService();