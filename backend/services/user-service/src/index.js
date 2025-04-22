import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import profileRoutes from './routes/profile.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8002;

// Initialize Prisma client
export const prisma = new PrismaClient();

// Apply middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  }
});
app.use(limiter);

// Mount routes
app.use('/profiles', profileRoutes);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User Profile service is up and running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Connected to database');
    
    app.listen(PORT, () => {
      logger.info(`🚀 User Profile service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  logger.info('Database connection closed');
  process.exit(0);
});