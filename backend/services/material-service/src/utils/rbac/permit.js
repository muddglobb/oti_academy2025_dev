import { authenticate } from './auth.js';
import { hasPermission } from './roles.js';
import { ApiResponse } from '../api-response.js';

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
export const permit = (...roles) => {
  return (req, res, next) => {
    authenticate(req, res, () => {
      // Add special permission for service-to-service requests
      if (!roles.length || roles.includes(req.user.role) || req.user.role === 'SERVICE') {
        next();
      } else {
        res.status(403).json(
          ApiResponse.error('Access denied. Insufficient privileges.')
        );
      }
    });
  };
};

/**
 * Permission-based authorization middleware
 * @param {string} permission - Required permission
 * @returns {Function} Express middleware
 */
export const permitWithPermission = (permission) => {
  return (req, res, next) => {
    authenticate(req, res, () => {
      if (hasPermission(req.user.role, permission)) {
        next();
      } else {
        res.status(403).json(
          ApiResponse.error(`Access denied. Required permission: ${permission}`)
        );
      }
    });
  };
};

/**
 * Middleware that allows access if user is requesting their own resource or is admin
 * @param {Function} getResourceUserId - Function that returns the user ID of the resource owner
 * @returns {Function} Express middleware
 */
export const permitSelfOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    authenticate(req, res, async () => {
      // Admin always has access
      if (req.user.role === 'ADMIN') {
        return next();
      }
      
      try {
        // Get the user ID of the resource owner
        const resourceUserId = await getResourceUserId(req);
        
        // Check if user is accessing their own resource
        if (req.user.id === resourceUserId) {
          return next();
        }
        
        // Otherwise deny access
        res.status(403).json(
          ApiResponse.error('Access denied. You can only access your own resources.')
        );
      } catch (error) {
        res.status(500).json(
          ApiResponse.error('Error validating resource ownership')
        );
      }
    });
  };
};