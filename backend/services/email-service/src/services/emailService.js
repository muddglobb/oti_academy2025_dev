import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import { google } from 'googleapis';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OAuth2 configuration
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET ;
const REDIRECT_URI = process.env.REDIRECT_URI ;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN ;

/**
 * Email Service for OmahTI Academy
 * Handles sending transactional emails using HTML templates
 */
class EmailService {
  constructor() {
    this.setupTransporter();
  }
  // Setup OAuth2 client and create transporter using Gmail API (HTTPS)
  async setupTransporter() {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );

      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      
      // Get access token
      const accessToken = await oAuth2Client.getAccessToken();
      
      // Create nodemailer transporter with OAuth2 using service: 'gmail'
      // This will use Gmail API via HTTPS (port 443) instead of SMTP
      this.transporter = nodemailer.createTransport({
        service: 'gmail',  // Uses Gmail API instead of direct SMTP
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken.token
        },
        // Increase timeout for API connections
        connectionTimeout: 10000,
        greetingTimeout: 10000
      });
      
      logger.info('Gmail API transporter set up successfully');
    } catch (error) {
      logger.error(`Error setting up Gmail API transporter: ${error.message}`);
      // Don't throw here, we'll handle it in verification
    }
    
    // Use more flexible path resolution for templates
    // Check if we're in development or production mode
    if (process.env.NODE_ENV === 'development') {
      // In development, templates are in src/templates
      this.templatesBasePath = path.join(__dirname, '..', 'templates');
    } else {
      // In production/Docker, templates should be in dist/templates
      this.templatesBasePath = path.join(process.cwd(), 'dist', 'templates');
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
      logger.info('Gmail API connection established successfully');
    } catch (error) {
      logger.error('Failed to establish connection to Gmail API:', error);
      // Don't crash the service, we'll retry later
      logger.info('Will retry connection on first email send attempt');
      // If we can't verify, we'll set up a retry mechanism
      this.needsReconnect = true;
    }
  }

  /**
   * Load a specific template from the templates directory
   * 
   * @param {string} templateName The name of the template (without extension)
   * @returns {Promise<string>} The HTML template as a string
   */
  async loadTemplate(templateName) {
    try {
      // Determine template path from name
      let templatePath;
      
      if (templateName === 'password-reset') {
        templatePath = path.join(this.templatesBasePath, 'password-reset', 'index.html');
      } else if (templateName === 'payment-confirmation') {
        templatePath = path.join(this.templatesBasePath, 'payment-confirmation', 'index.html');
      } else if (templateName === 'enrollment-confirmation') {
        templatePath = path.join(this.templatesBasePath, 'enrollment-confirmation', 'index.html');
      } else {
        throw new Error(`Template "${templateName}" not found`);
      }
      
      // Log the path we're trying to access
      logger.info(`Attempting to load template from: ${templatePath}`);
      
      try {
        // First try with fs.readFile
        const template = await fs.readFile(templatePath, 'utf8');
        return template;
      } catch (error) {
        // If that fails, try with require (for bundled environments)
        logger.warn(`Failed to read template with fs, trying alternative method: ${error.message}`);
        
        // Create a basic fallback template
        const fallbackTemplate = `
          <html>
            <body>
              <h1>${templateName}</h1>
              <p>This is a fallback template because the original could not be loaded.</p>
              ${templateName === 'password-reset' 
                ? '<p>Click on the link to reset your password: <a href="{{resetLink}}">Reset Password</a></p>' 
                : ''}
            </body>
          </html>
        `;
        
        return fallbackTemplate;
      }
    } catch (error) {
      logger.error(`Failed to load email template "${templateName}":`, error);
      throw new Error(`Failed to load email template: ${error.message}`);
    }
  }

  /**
   * Replace variables in the template with actual values
   * 
   * @param {string} template The HTML template
   * @param {Object} variables The variables to replace in the template
   * @returns {string} The template with replaced variables
   */
  replaceTemplateVariables(template, variables = {}) {
    let result = template;

    // Replace all variables in the template (format: {{variableName}})
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    });

    // Remove any unused variables
    result = result.replace(/{{.*?}}/g, '');

    return result;
  }
  /**
   * Send an email using a template
   * 
   * @param {Object} options Email options including recipient, subject, template name, and variables
   * @returns {Promise<void>} Promise that resolves when the email is sent
   */
  async sendEmail(options) {
    const { to, subject, templateName, variables } = options;

    try {
      // Check if we need to reconnect
      if (this.needsReconnect || !this.transporter) {
        logger.info('Trying to reconnect to Gmail API before sending email');
        await this.setupTransporter();
        this.needsReconnect = false;
      }

      // Load template
      const template = await this.loadTemplate(templateName);
      
      // Replace variables in template
      const html = this.replaceTemplateVariables(template, variables);

      // Send email
      const info = await this.transporter.sendMail({
        from: this.from,
        to: Array.isArray(to) ? to.join(',') : to,
        subject,
        html,
      });

      logger.info(`Email sent successfully via Gmail API: ${info.messageId}`, { 
        templateName,
        subject,
        recipients: to
      });
      
      return info;
    } catch (error) {
      logger.error('Failed to send email:', error);
      
      // If authentication error, try to refresh transporter
      if (error.message.includes('auth') || 
          error.message.includes('credentials') ||
          error.message.includes('ETIMEDOUT')) {
        logger.info('Will try to reconnect on next email attempt');
        this.needsReconnect = true;
      }
      
      // Don't crash the entire service, but do throw so the message can be retried
      throw new Error(`Email sending failed: ${error.message}`);
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
  async sendPaymentConfirmationEmail(
    to,
    username,
    courseName,
    amount,
    transactionId,
    date
  ) {
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
   * @param {string} courseLink Link to access the course
   */
  async sendEnrollmentConfirmationEmail(
    to,
    username,
    courseName,
    startDate,
    courseLink
  ) {
    return await this.sendEmail({
      to,
      subject: `Welcome to ${courseName} - OmahTI Academy`,
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

// Create singleton instance
const emailService = new EmailService();
export default emailService;
