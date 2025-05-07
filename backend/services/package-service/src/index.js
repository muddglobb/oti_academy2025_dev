import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import packageRoutes from './routes/package.routes.js';
import packageCourseRoutes from './routes/packageCourse.routes.js';
import packageCoursesNestedRoutes from './routes/packageCourses.nested.js';
import { createRateLimiter } from './middlewares/rateLimiter.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8005;

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Fungsi untuk menjalankan seeder jika database kosong
 */
async function checkAndRunSeeder() {
  try {
    // Check if auto-seeding is disabled via environment variable
    if (process.env.DISABLE_AUTO_SEED === 'true') {
      console.log('🚫 Auto-seeding is disabled by environment variable');
      return;
    }
    
    console.log('📊 Checking if seed data is needed...');
    
    // Cek apakah sudah ada package di database
    const existingPackagesCount = await prisma.package.count();
    
    // Jika tidak ada package, jalankan seeder
    if (existingPackagesCount === 0) {
      console.log('🌱 Database kosong, menjalankan seeder...');
      
      // Mendapatkan path absolut ke direktori seed.js
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const rootDir = path.resolve(__dirname, '..');
      const seedPath = path.join(rootDir, 'prisma', 'seed.js');
      
      // Menjalankan seeder dengan promisify untuk mengontrol alur eksekusi dengan lebih baik
      return new Promise((resolve, reject) => {
        exec(`node ${seedPath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`❌ Error menjalankan seeder: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`⚠️ Seeder stderr: ${stderr}`);
          }
          console.log(`✅ Seeder berhasil dijalankan: ${stdout}`);
          resolve();
        });
      });
    } else {
      console.log(`✅ Data sudah ada (${existingPackagesCount} package ditemukan), tidak perlu menjalankan seeder.`);
    }
  } catch (error) {
    console.error('❌ Error saat memeriksa database:', error.message);
  }
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Apply rate limiter
const apiLimiter = createRateLimiter({
  name: 'API General',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply stricter rate limits for write operations
const writeLimiter = createRateLimiter({
  name: 'Write Operations',
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30 // limit each IP to 30 write requests per hour
});

// Apply rate limiter to all routes
app.use(Array.isArray(apiLimiter) ? apiLimiter : [apiLimiter]);

// Routes
app.use('/packages', packageRoutes);
app.use('/packages/:packageId/courses', packageCoursesNestedRoutes);
app.use('/package-courses', packageCourseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Package service is running'
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
    
    // Jalankan pengecekan dan seeder jika diperlukan
    await checkAndRunSeeder();
    
    app.listen(PORT, () => {
      console.log(`🚀 Package service running on port ${PORT}`);
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