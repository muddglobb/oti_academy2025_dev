
import { Roles, Permissions, hasPermission, isStudent, 
         authenticate as authMiddleware, permit as permitMiddleware, ApiResponse } from './roles.js';

/**
 * Authentication middleware that verifies JWT and sets user info on req.user
 */
export const authenticate = authMiddleware;

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
export const permit = permitMiddleware;

/**
 * Authorization middleware for students (DIKE or UMUM)
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

/**
 * Authorization middleware that permits access if it's the user's own resource or if user is admin
 * @param {Function} getUserIdFromRequest - Function to extract the target user ID from the request
 */
export const permitSelfOrAdmin = (getUserIdFromRequest) => {
  return (req, res, next) => {
    authenticate(req, res, () => {
      const targetUserId = getUserIdFromRequest(req);
      
      // Allow if admin or if it's user's own resource
      if (req.user.role === Roles.ADMIN || req.user.id === targetUserId) {
        next();
      } else {
        res.status(403).json(
          ApiResponse.error('Access denied. You can only access your own resources.')
        );
      }
    });
  };
};

export {
  Roles,
  Permissions,
  hasPermission,
  isStudent,
  ApiResponse
};
