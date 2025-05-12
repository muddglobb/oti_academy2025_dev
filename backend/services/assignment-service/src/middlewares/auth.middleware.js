import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ApiResponse } from '../utils/api-response.js';
import { Roles } from '../utils/rbac/roles.js';

/**
 * Middleware to authenticate users via JWT token
 * Can authenticate from Authorization header or from cookies
 */
export const authenticate = async (req, res, next) => {
  // First check for token in cookies (priority)
  let token = req.cookies?.accessToken;
  
  // If not in cookies, try to get from Authorization header
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
    // Try local verification first if JWT_SECRET is available
    if (process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id || decoded.sub,
          role: decoded.role
        };
        return next();
      } catch (localError) {
        console.log('Local token verification failed, trying auth service');
      }
    }
    
    // If local verification fails or no JWT_SECRET, verify with auth service
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:8001';
    
    const response = await axios.post(
      `${authServiceUrl}/auth/validate-token`, 
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
 * @param {...string} allowedRoles - Roles allowed to access the resource
 */
export const permit = (...allowedRoles) => {
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
 * Middleware to check if user is accessing their own resource or is an admin
 * @param {Function} getUserIdFromParams - Function to extract the user ID from request params
 * @returns {Function} Express middleware
 */
export const permitSelfOrAdmin = (getUserIdFromParams) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required')
      );
    }
    
    const resourceUserId = getUserIdFromParams(req);
    
    // Allow if admin
    if (req.user.role === Roles.ADMIN) {
      return next();
    }
    
    // Allow if user is accessing their own resource
    if (req.user.id === resourceUserId) {
      return next();
    }
    
    return res.status(403).json(
      ApiResponse.error('Access denied. You can only access your own resources.')
    );
  };
};

/**
 * Verify service-to-service communication
 */
export const verifyService = (req, res, next) => {
  // Get service API key from header
  const apiKey = req.headers['x-service-api-key'];
  
  if (!apiKey) {
    return res.status(401).json(
      ApiResponse.error('Service API key required')
    );
  }
  
  // Check if API key matches environment variable
  if (apiKey !== process.env.SERVICE_API_KEY) {
    return res.status(401).json(
      ApiResponse.error('Invalid service API key')
    );
  }
  
  next();
};

/**
 * Middleware to authorize only students (DIKE or UMUM roles)
 */
export const authorizeStudents = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      ApiResponse.error('Authentication required')
    );
  }
  
  if (req.user.role !== Roles.DIKE && req.user.role !== Roles.UMUM) {
    return res.status(403).json(
      ApiResponse.error('Access denied. Only students can access this resource')
    );
  }
  
  next();
};

/**
 * Generate a JWT token for service-to-service communication
 * @returns {string} JWT token
 */
export const generateServiceToken = () => {
  const payload = {
    service: 'assignment-service',
    role: 'SERVICE'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};