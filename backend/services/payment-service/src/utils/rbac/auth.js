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
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;
  
  if (!token) {
    return res.status(401).json(
      ApiResponse.error('Access denied. No token provided.')
    );
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