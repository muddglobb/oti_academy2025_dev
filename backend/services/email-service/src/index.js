// Email service main entry point - JavaScript version
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import emailRoutes from './routes/emailRoutes.js';
import { errorHandler, validateApiKey } from './middlewares/index.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import { initializeRabbitMQ } from './services/rabbitmqService.js';

// Create Express application
const app = express();

// Apply security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Apply API key validation to all email routes
app.use('/email', validateApiKey, emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'email-service',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
const server = app.listen(PORT, async () => {
  logger.info(`Email service running on port ${PORT} in ${config.env} mode`);
  
  // Initialize RabbitMQ consumer after server starts
  try {
    await initializeRabbitMQ();
    logger.info('RabbitMQ connection established');
  } catch (error) {
    logger.error('Failed to initialize RabbitMQ:', error);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export default app;
