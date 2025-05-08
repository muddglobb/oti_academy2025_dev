import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from './api-response.js';
import { isStudent } from './roles.js';

const prisma = new PrismaClient();

/**
 * JWT authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = (req, res, next) => {
  // Pertama cek apakah token ada di cookie (prioritas utama)
  let token = req.cookies?.accessToken;
  
  // Jika tidak ada di cookie, coba ambil dari header (backwards compatibility)
  if (!token) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        ApiResponse.error('Authentication required. No token provided.')
      );
    }
    
    token = authHeader.split(' ')[1];
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request - normalize ID field
    req.user = {
      id: decoded.id || decoded.userId || decoded.sub,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        ApiResponse.error('Token expired. Please login again.')
      );
    }
    
    return res.status(401).json(
      ApiResponse.error('Invalid token')
    );
  }
};

/**
 * Middleware untuk membatasi akses hanya untuk student (DIKE atau UMUM)
 */
export const authorizeStudents = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      ApiResponse.error('Authentication required')
    );
  }
  
  if (!isStudent(req.user.role)) {
    return res.status(403).json(
      ApiResponse.error('Access denied. Only students can access this resource')
    );
  }
  
  next();
};