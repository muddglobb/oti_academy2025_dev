import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import paymentRoutes from './routes/payment.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import groupPaymentRoutes from './routes/group-payment.routes.js';
import { createRateLimiter } from './middlewares/rateLimiter.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8005;

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable credentials (cookies, auth headers)
}));
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(morgan('dev'));

// Apply rate limiter
const apiLimiter = createRateLimiter({
  name: 'API General',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all routes
app.use(Array.isArray(apiLimiter) ? apiLimiter : [apiLimiter]);
// Routes
app.use('/payments', paymentRoutes);
app.use('/group-payments', groupPaymentRoutes);
app.use('/enrollments', enrollmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Payment and enrollment service is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error', 
    message: `Not found - ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    app.listen(PORT, () => {
      console.log(`🚀 Payment & Enrollment service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});