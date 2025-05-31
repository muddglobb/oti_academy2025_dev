/**
 * Email Service Configuration
 */
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Default configuration with fallbacks
const config = {
  port: parseInt(process.env.PORT || '8008', 10),
  env: process.env.NODE_ENV || 'development',
  email: {
    user: process.env.EMAIL_USER || 'noreply-omahti-academy@omahti.web.id',
    password: process.env.EMAIL_PASSWORD || '',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
  },
  apiKey: process.env.API_KEY,  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // default 15 minutes (900000 ms)
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    queues: {
      emailQueue: 'email_queue',
      deadLetterQueue: 'email_dead_letter_queue'
    },
    exchange: 'email_exchange',
    retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(process.env.RETRY_DELAY || '5000', 10), // 5 seconds
  }
};

export default config;
