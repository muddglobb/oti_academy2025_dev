import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/api-response.js';

/**
 * Middleware to validate JWT tokens and set authenticated user in request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
export const authenticateJWT = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  // Check if auth header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      ApiResponse.error('Authentication required. No token provided.')
    );
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json(
      ApiResponse.error('Invalid or expired token')
    );
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...string} roles - Allowed roles
 * @returns {Function} - Express middleware function
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required')
      );
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        ApiResponse.error(`Access denied. Role ${req.user.role} not authorized.`)
      );
    }
    
    next();
  };
};