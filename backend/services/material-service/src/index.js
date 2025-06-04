import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import config from './config/index.js';

// Import routes
import materialRoutes from './routes/material.routes.js';

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/materials', materialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Material service is running',
    timestamp: new Date().toISOString()
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

// Wait for course service to be ready
const waitForCourseService = async (maxRetries = 30, retryDelay = 10000) => {
  // Perbaiki cara mendapatkan URL
  const courseServiceUrl = process.env.COURSE_SERVICE_URL || config.COURSE_SERVICE_URL;
  
  // Validasi URL sebelum digunakan
  if (!courseServiceUrl) {
    console.error('❌ COURSE_SERVICE_URL not configured');
    throw new Error('Course service URL not configured');
  }
  
  console.log(`🔗 Checking course service at ${courseServiceUrl}`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Checking course service readiness (attempt ${attempt}/${maxRetries})...`);
      
      // Tambahkan validasi URL
      const url = new URL(`${courseServiceUrl}/health`);
      
      const response = await axios.get(url.toString(), {
        timeout: 8000, // Tingkatkan timeout
        headers: {
          'User-Agent': 'material-service-startup-check'
        }
      });
      
      if (response.status === 200 && response.data.status === 'success') {
        console.log('✅ Course service is ready!');
        
        // Additional check: verify course service has data (courses available)
        try {
          // Generate service token for verification
          const jwt = await import('jsonwebtoken');
          const serviceToken = jwt.sign(
            { service: 'material-service', role: 'SERVICE' },
            config.JWT_SECRET,
            { expiresIn: '1h' }
          );
          
          const coursesUrl = new URL(`${courseServiceUrl}/courses`);
          const coursesResponse = await axios.get(coursesUrl.toString(), {
            headers: {
              'Authorization': `Bearer ${serviceToken}`
            },
            timeout: 8000
          });
          
          if (coursesResponse.data && coursesResponse.data.data && coursesResponse.data.data.length > 0) {
            console.log(`✅ Course service has ${coursesResponse.data.data.length} courses available!`);
            return true;
          } else {
            console.log('⚠️ Course service is healthy but no courses found, waiting for seeding...');
          }
        } catch (verifyError) {
          console.log('⚠️ Course service health OK but data verification failed, continuing...');
        }
        
        return true;
      }
    } catch (error) {
      console.log(`⏳ Course service not ready (attempt ${attempt}/${maxRetries}): ${error.message}`);
      
      if (attempt === maxRetries) {
        console.error('❌ Course service is not available after maximum retries');
        throw new Error('Course service dependency check failed');
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

// Start server
const startServer = async () => {
  try {
    // Wait for course service to be ready before starting
    console.log('🔗 Waiting for course service dependency...');
    await waitForCourseService();
    
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const PORT = config.PORT || 8003;
    app.listen(PORT, () => {
      console.log(`🚀 Material service running on port ${PORT}`);
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

export default app;