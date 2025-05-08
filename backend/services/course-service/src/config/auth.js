/**
 * Re-export RBAC modules for consistent auth across services
 */
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/api-response.js';

/**
 * Constants for role-based access control
 */
export const Roles = {
  ADMIN: 'ADMIN',
  DIKE: 'DIKE',
  UMUM: 'UMUM',
  USER: 'USER',
  SERVICE: 'SERVICE'
};

/**
 * Middleware to authenticate users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      ApiResponse.error('Authentication required. No token provided.')
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request
    req.user = {
      id: decoded.id || decoded.sub,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json(
      ApiResponse.error('Invalid or expired token')
    );
  }
};

/**
 * Middleware to authorize specific roles
 * @param {...string} roles - Allowed roles
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
        ApiResponse.error(`Access denied. Role '${req.user.role}' is not permitted to perform this action.`)
      );
    }
    
    next();
  };
};

/**
 * Middleware for restricting access based on permission level
 * @param {string} requiredRole - Minimum role required
 */
export const permit = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required')
      );
    }

    // Check if user has the required role
    if (req.user.role !== requiredRole && req.user.role !== Roles.ADMIN) {
      return res.status(403).json(
        ApiResponse.error(`Access denied. Role ${requiredRole} or ADMIN required.`)
      );
    }

    next();
  };
};