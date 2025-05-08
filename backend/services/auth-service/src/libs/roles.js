/**
 * Role definitions for OTI Academy application
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

// Permission mapping for more granular access control if needed
export const Permissions = {
    [Roles.ADMIN]: [
        'user:read', 'user:write', 'user:delete',
        'course:read', 'course:write', 'course:delete',
        'assignment:read', 'assignment:write', 'assignment:grade',
        'student:import'
    ],
    [Roles.DIKE]: [
        'user:read:self', 'user:write:self',
        'course:read', 'course:enroll',
        'assignment:read', 'assignment:submit'
    ],
    [Roles.UMUM]: [
        'user:read:self', 'user:write:self',
        'course:read', 'course:enroll',
        'assignment:read', 'assignment:submit'
    ],
    [Roles.USER]: [
        'user:read:self',
        'course:read'
    ],
    [Roles.SERVICE]: [
        'user:read',  // Allow services to read user data
        'course:read',
        'package:read'
    ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether the role has the permission
 */
export const hasPermission = (role, permission) => {
    if (!role || !permission) return false;
    return Permissions[role]?.includes(permission) || false;
};