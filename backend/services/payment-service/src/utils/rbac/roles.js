/**
 * Roles and Permissions definitions for OTI Academy Payment Service
 */

// Role definitions
export const Roles = {
  ADMIN: 'ADMIN',  
  DIKE: 'DIKE',
  UMUM: 'UMUM',
  USER: 'USER'     // Generic user role (fallback)
};

// Permission definitions
export const Permissions = {
  CREATE_PAYMENT: 'CREATE_PAYMENT',
  VIEW_ANY_PAYMENT: 'VIEW_ANY_PAYMENT',
  VIEW_OWN_PAYMENT: 'VIEW_OWN_PAYMENT',
  APPROVE_PAYMENT: 'APPROVE_PAYMENT',
  REQUEST_BACK: 'REQUEST_BACK',
  COMPLETE_BACK: 'COMPLETE_BACK'
};

// Role-permission mapping
const rolePermissions = {
  [Roles.ADMIN]: [
    Permissions.CREATE_PAYMENT,
    Permissions.VIEW_ANY_PAYMENT,
    Permissions.VIEW_OWN_PAYMENT,
    Permissions.APPROVE_PAYMENT,
    Permissions.COMPLETE_BACK
  ],
  [Roles.DIKE]: [
    Permissions.CREATE_PAYMENT,
    Permissions.VIEW_OWN_PAYMENT,
    Permissions.REQUEST_BACK
  ],
  [Roles.UMUM]: [
    Permissions.CREATE_PAYMENT,
    Permissions.VIEW_OWN_PAYMENT
  ],
  [Roles.USER]: [
    Permissions.VIEW_OWN_PAYMENT
  ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Required permission
 * @returns {boolean} True if the role has the permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  
  // Admin has all permissions
  if (role === Roles.ADMIN) return true;
  
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
};

/**
 * Check if a role is a student role (DIKE or UMUM)
 * @param {string} role - User role 
 * @returns {boolean} True if the role is a student role
 */
export const isStudent = (role) => {
  return role === Roles.DIKE || role === Roles.UMUM;
};