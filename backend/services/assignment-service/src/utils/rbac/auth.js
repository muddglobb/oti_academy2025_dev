import jwt from 'jsonwebtoken';
import { ApiResponse } from '../api-response.js';
import { isStudent } from './roles.js';

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
    
    // Add user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        ApiResponse.error('Token expired. Please login again.')
      );
    }
    
    return res.status(401).json(
      ApiResponse.error('Invalid token.')
    );
  }
};

/**
 * Middleware to authorize students (DIKE or UMUM)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authorizeStudents = (req, res, next) => {
  authenticate(req, res, () => {
    if (isStudent(req.user.role)) {
      next();
    } else {
      res.status(403).json(
        ApiResponse.error('Access denied. Student role required.')
      );
    }
  });
};