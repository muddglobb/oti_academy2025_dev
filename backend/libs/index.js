/**
 * RBAC (Role-Based Access Control) library for OTI Academy
 * Provides centralized authentication and authorization functionality
 */

import { Roles, Permissions, hasPermission } from './roles.js';
import { authenticate } from './middlewares/auth.js';
import { permit, permitWithPermission } from './middlewares/permit.js';

export {
  // Role and permission constants
  Roles,
  Permissions,
  
  // Permission utility
  hasPermission,
  
  // Authentication middleware
  authenticate,
  
  // Authorization middlewares
  permit,              // Role-based authorization
  permitWithPermission // Permission-based authorization
};