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
      // Menambahkan izin khusus untuk request dari service lain
      // Service lain diizinkan mengakses jika mereka menggunakan token valid service
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
          ApiResponse.error('Access denied. Required permission not found.')
        );
      }
    });
  };
};

/**
 * Middleware to allow access to self-resource or admin
 * @param {Function} paramIdExtractor - Function to extract resource owner ID
 * @returns {Function} Express middleware
 */
export const permitSelfOrAdmin = (paramIdExtractor) => {
  return (req, res, next) => {
    authenticate(req, res, () => {
      // Always allow admins
      if (req.user.role === 'ADMIN') {
        return next();
      }
      
      const resourceOwnerId = paramIdExtractor(req);
      
      // Allow if user is accessing their own resource
      if (req.user.id === resourceOwnerId) {
        return next();
      }
      
      // Deny otherwise
      return res.status(403).json(
        ApiResponse.error('Access denied. You can only access your own resources.')
      );
    });
  };
};