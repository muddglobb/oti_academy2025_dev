/**
 * RBAC (Role-Based Access Control) library for OTI Academy
 * Provides centralized authentication and authorization functionality
 */

import { Roles, Permissions, hasPermission, isStudent } from './roles.js';
import { authenticate, authorizeStudents } from './middlewares/auth.js';
import { permit, permitWithPermission, permitSelfOrAdmin } from './middlewares/permit.js';
import { ApiResponse } from './utils/api-response.js';

export {
  // Role and permission constants
  Roles,
  Permissions,
  
  // Permission utility
  hasPermission,
  isStudent,
  
  // Authentication middleware
  authenticate,
  authorizeStudents,
  
  // Authorization middlewares
  permit,              // Role-based authorization
  permitWithPermission, // Permission-based authorization
  permitSelfOrAdmin,   // Self or admin authorization
  
  // API response formatter
  ApiResponse
};