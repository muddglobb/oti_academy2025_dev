import { hasPermission } from '../../roles.js';
import { ApiResponse } from '../utils/api-response.js';

/**
 * Creates a middleware for role-based authorization
 * @param {...string} allowedRoles - Array of allowed roles for this route
 * @returns {Function} Express middleware that enforces role requirements
 */
export const permit = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required before authorization')
      );
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      // Log unauthorized access attempt
      console.warn(`Unauthorized access attempt: User ID ${req.user.id} with role ${req.user.role} tried to access a route requiring ${allowedRoles.join(', ')}`);
      
      return res.status(403).json(
        ApiResponse.error(`Access denied. Role '${req.user.role}' is not permitted to perform this action.`)
      );
    }

    next();
  };
};

/**
 * Creates a middleware for permission-based authorization
 * @param {string} requiredPermission - Permission required for this route
 * @returns {Function} Express middleware that enforces permission requirements
 */
export const permitWithPermission = (requiredPermission) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required before authorization')
      );
    }

    // Check if user's role has the required permission
    if (!hasPermission(req.user.role, requiredPermission)) {
      // Log unauthorized access attempt
      console.warn(`Permission denied: User ID ${req.user.id} with role ${req.user.role} tried to access a route requiring permission ${requiredPermission}`);
      
      return res.status(403).json(
        ApiResponse.error(`Access denied. Your role does not have the '${requiredPermission}' permission.`)
      );
    }

    next();
  };
};