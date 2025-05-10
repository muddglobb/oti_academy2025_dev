/**
 * Role-based access control (RBAC) implementation for the Enrollment Service
 */

// Define roles
export const Roles = {
  ADMIN: 'ADMIN',
  DIKE: 'DIKE',
  UMUM: 'UMUM'
};

// Define permissions
export const Permissions = {
  VIEW_ENROLLMENTS: 'view_enrollments',
  CREATE_ENROLLMENT: 'create_enrollment',
  DELETE_ENROLLMENT: 'delete_enrollment',
  VIEW_ALL_ENROLLMENTS: 'view_all_enrollments',
};

// Check if user has specific permission
export const hasPermission = (userRole, permission) => {
  const rolePermissions = {
    [Roles.ADMIN]: [
      Permissions.VIEW_ENROLLMENTS,
      Permissions.CREATE_ENROLLMENT,
      Permissions.DELETE_ENROLLMENT,
      Permissions.VIEW_ALL_ENROLLMENTS
    ],
    [Roles.DIKE]: [
      Permissions.VIEW_ENROLLMENTS,
    ],
    [Roles.UMUM]: [
      Permissions.VIEW_ENROLLMENTS,
    ]
  };

  return rolePermissions[userRole]?.includes(permission) || false;
};

// Check if user is a student (DIKE or UMUM)
export const isStudent = (role) => {
  return role === Roles.DIKE || role === Roles.UMUM;
};

// Import local API response utility
import { ApiResponse } from '../api-response.js';

import jwt from 'jsonwebtoken';

/**
 * Authentication middleware that verifies JWT and sets user info on req.user
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      ApiResponse.error('Authentication required. Please provide a valid token.')
    );
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Proper JWT verification using environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request object
    req.user = {
      id: decoded.id || decoded.sub,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json(
      ApiResponse.error('Invalid token. Authentication failed.')
    );
  }
};

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
export const permit = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required.')
      );
    }

    if (roles.length === 0 || roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json(
        ApiResponse.error('Access denied. Insufficient permissions.')
      );
    }
  };
};

/**
 * Authorization middleware for students (DIKE or UMUM)
 */
export const authorizeStudents = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      ApiResponse.error('Authentication required.')
    );
  }
  
  if (isStudent(req.user.role)) {
    next();
  } else {
    res.status(403).json(
      ApiResponse.error('Access denied. Student role required.')
    );
  }
};

/**
 * Authorization middleware that permits access if it's the user's own resource or if user is admin
 * @param {Function} getUserIdFromRequest - Function to extract the target user ID from the request
 */
export const permitSelfOrAdmin = (getUserIdFromRequest) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required.')
      );
    }
    
    const targetUserId = getUserIdFromRequest(req);
    
    // Allow if admin or if it's user's own resource
    if (req.user.role === Roles.ADMIN || req.user.id === targetUserId) {
      next();
    } else {
      res.status(403).json(
        ApiResponse.error('Access denied. You can only access your own resources.')
      );
    }
  };
};

export { ApiResponse };
