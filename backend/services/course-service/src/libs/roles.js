/**
 * Role definitions untuk OTI Academy
 * Digunakan di semua microservices untuk konsistensi access control
 */

// Define roles sebagai constants
export const Roles = {
    ADMIN: 'ADMIN',   // Full system access
    DIKE: 'DIKE',     // DIKE student access
    UMUM: 'UMUM',     // Regular student access
    USER: 'USER'      // Basic user access
};

export const isStudent = (role) => {
    return role === Roles.DIKE || role === Roles.UMUM;
};

// Permission mapping untuk granular access control jika diperlukan
export const Permissions = {
    [Roles.ADMIN]: [
        'user:read', 'user:write', 'user:delete',
        'course:read', 'course:write', 'course:delete',
        'course:enroll:manage',
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
    ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether the role has the permission
 */
export const hasPermission = (role, permission) => {
    if (!Permissions[role]) {
        return false;
    }
    return Permissions[role].includes(permission);
};