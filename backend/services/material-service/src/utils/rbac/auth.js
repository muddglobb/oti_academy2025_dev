import jwt from 'jsonwebtoken';
import { ApiResponse } from '../api-response.js';
import { isStudent } from './roles.js';
import config from '../../config/index.js';

/**
 * JWT authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = (req, res, next) => {
  // First check if token is in cookie (priority)
  let token = req.cookies?.access_token;
  
  // If not in cookie, try from header (backwards compatibility)
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
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Add user info to request object
    req.user = {
      id: decoded.id || decoded.userId || decoded.sub,
      role: decoded.role,
      email: decoded.email
    };
    
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