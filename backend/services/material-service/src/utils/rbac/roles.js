/**
 * Role definitions for OTI Academy Material Service
 * Used across all microservices for consistent access control
 */

// Define roles as constants to prevent typos and ensure consistency
export const Roles = {
  ADMIN: 'ADMIN',   // Full system access
  DIKE: 'DIKE',     // DIKE student access
  UMUM: 'UMUM',     // Regular student access
  USER: 'USER',     // Basic user access
  SERVICE: 'SERVICE' // Service-to-service communication
};

// Helper function to check if a user is a student
export const isStudent = (role) => {
  return role === Roles.DIKE || role === Roles.UMUM;
};

// Define permission constants for material operations
export const Permissions = {
  // Material permissions
  CREATE_MATERIAL: 'material:create',
  VIEW_MATERIAL: 'material:read',
  UPDATE_MATERIAL: 'material:update',
  DELETE_MATERIAL: 'material:delete',
  
  // Section permissions
  CREATE_SECTION: 'section:create',
  VIEW_SECTION: 'section:read',
  UPDATE_SECTION: 'section:update',
  DELETE_SECTION: 'section:delete',
  
  // Course-related permissions for materials
  VIEW_COURSE_MATERIALS: 'course:material:read'
};

// Role-permission mapping
const rolePermissions = {
  [Roles.ADMIN]: [
    Permissions.CREATE_MATERIAL,
    Permissions.VIEW_MATERIAL,
    Permissions.UPDATE_MATERIAL,
    Permissions.DELETE_MATERIAL,
    Permissions.CREATE_SECTION,
    Permissions.VIEW_SECTION,
    Permissions.UPDATE_SECTION,
    Permissions.DELETE_SECTION,
    Permissions.VIEW_COURSE_MATERIALS
  ],
  [Roles.DIKE]: [
    Permissions.VIEW_MATERIAL,
    Permissions.VIEW_SECTION,
    Permissions.VIEW_COURSE_MATERIALS
  ],
  [Roles.UMUM]: [
    Permissions.VIEW_MATERIAL,
    Permissions.VIEW_SECTION,
    Permissions.VIEW_COURSE_MATERIALS
  ],
  [Roles.USER]: [
    Permissions.VIEW_MATERIAL,
    Permissions.VIEW_SECTION,
    Permissions.VIEW_COURSE_MATERIALS
  ],
  [Roles.SERVICE]: [
    Permissions.VIEW_MATERIAL,
    Permissions.VIEW_SECTION,
    Permissions.VIEW_COURSE_MATERIALS
  ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether the role has the permission
 */
export const hasPermission = (role, permission) => {
  if (!rolePermissions[role]) {
    return false;
  }
  return rolePermissions[role].includes(permission);
};