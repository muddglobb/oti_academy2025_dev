/**
 * RBAC (Role-Based Access Control) library untuk OTI Academy Package Service
 */

import { Roles, Permissions, hasPermission, isStudent } from './roles.js';
import { authenticate, authorizeStudents } from './auth.js';
import { permit, permitWithPermission, permitSelfOrAdmin } from './permit.js';
import { ApiResponse } from './api-response.js';

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