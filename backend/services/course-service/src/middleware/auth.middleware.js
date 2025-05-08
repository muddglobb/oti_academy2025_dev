import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ApiResponse } from '../utils/api-response.js';
import config from '../config/index.js';
import { Roles, isStudent } from '../libs/roles.js';

/**
 * Middleware to authenticate users
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
    // Try local verification first (if JWT_SECRET is available)
    if (config.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = {
          id: decoded.id || decoded.sub,
          role: decoded.role
        };
        return next();
      } catch (localError) {
        console.log('Local token verification failed, trying auth service');
      }
    }

    // If local verification fails, verify with auth service
    const response = await axios.post(
      `${config.AUTH_SERVICE_URL}/api/auth/verify`, 
      { token },
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000 // 5 second timeout
      }
    );
    
    if (response.data.status === 'success') {
      req.user = response.data.data;
      next();
    } else {
      return res.status(401).json(
        ApiResponse.error('Authentication failed')
      );
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json(
      ApiResponse.error('Invalid or expired token')
    );
  }
};

/**
 * Middleware to authorize specific roles
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required before authorization')
      );
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(
        ApiResponse.error(`Access denied. Role '${req.user.role}' is not permitted to perform this action.`)
      );
    }
    
    next();
  };
};

/**
 * Middleware to authorize only students
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