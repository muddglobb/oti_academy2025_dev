import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import usersRoutes from './routes/user.routes.js';
import { ApiResponse } from './utils/api-response.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8001;

// Initialize Prisma client
const prisma = new PrismaClient();

// Admin account initialization function
async function initializeAdminAccount() {
  try {
    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Check if admin password is set
    if (!adminPassword) {
      console.error('❌ Error: ADMIN_PASSWORD environment variable is required');
      console.error('For security reasons, hardcoded passwords are not allowed.');
      return; // Don't exit the process, but skip admin creation
    }
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'omahtiacademy@gmail.com' }
    });

    // If admin doesn't exist, create it
    if (!existingAdmin) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      // Create admin user
      const admin = await prisma.user.create({
        data: {
          name: 'OTI Academy',
          email: 'omahtiacademy@gmail.com',
          password: hashedPassword,
          role: 'ADMIN',
          type: 'UMUM', 
        },
      });

      console.log('✅ Admin account created:', admin.email);
    } else {
      console.log('ℹ️ Admin account already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  }
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies to be sent with requests
})); 
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/auth/admin', adminRoutes);
app.use('/users', usersRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Auth service is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(
    ApiResponse.error(`Not found - ${req.originalUrl}`)
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json(
    ApiResponse.error(message, err.errors || null)
  );
});

// Start server - MODIFIED VERSION
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Initialize admin account
    await initializeAdminAccount();
    
    app.listen(PORT, () => {
      console.log(`🚀 Auth service running on port ${PORT}`);
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