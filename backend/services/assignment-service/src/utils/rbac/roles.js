/**
 * Role definitions for OTI Academy Assignment Service
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

// Define permission constants for assignment operations
export const Permissions = {
    // Assignment permissions
    CREATE_ASSIGNMENT: 'assignment:create',
    VIEW_ASSIGNMENT: 'assignment:read',
    UPDATE_ASSIGNMENT: 'assignment:update',
    DELETE_ASSIGNMENT: 'assignment:delete',
    
    // Submission permissions
    SUBMIT_ASSIGNMENT: 'assignment:submit',
    GRADE_SUBMISSION: 'assignment:grade',
    VIEW_SUBMISSION: 'assignment:submission:read',
    VIEW_ANY_SUBMISSION: 'assignment:submission:read:any',
    
    // Course-related permissions for assignments
    VIEW_COURSE_ASSIGNMENTS: 'course:assignment:read'
};

// Role-permission mapping
const rolePermissions = {
    [Roles.ADMIN]: [
        Permissions.CREATE_ASSIGNMENT,
        Permissions.VIEW_ASSIGNMENT,
        Permissions.UPDATE_ASSIGNMENT,
        Permissions.DELETE_ASSIGNMENT,
        Permissions.GRADE_SUBMISSION,
        Permissions.VIEW_SUBMISSION,
        Permissions.VIEW_ANY_SUBMISSION,
        Permissions.VIEW_COURSE_ASSIGNMENTS
    ],
    [Roles.DIKE]: [
        Permissions.VIEW_ASSIGNMENT,
        Permissions.SUBMIT_ASSIGNMENT,
        Permissions.VIEW_SUBMISSION, // Can only view own submissions
        Permissions.VIEW_COURSE_ASSIGNMENTS
    ],
    [Roles.UMUM]: [
        Permissions.VIEW_ASSIGNMENT,
        Permissions.SUBMIT_ASSIGNMENT,
        Permissions.VIEW_SUBMISSION, // Can only view own submissions
        Permissions.VIEW_COURSE_ASSIGNMENTS
    ],
    [Roles.USER]: [
        Permissions.VIEW_ASSIGNMENT,
        Permissions.VIEW_COURSE_ASSIGNMENTS
    ],
    [Roles.SERVICE]: [
        Permissions.VIEW_ASSIGNMENT,
        Permissions.VIEW_SUBMISSION,
        Permissions.VIEW_ANY_SUBMISSION,
        Permissions.VIEW_COURSE_ASSIGNMENTS
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

// Import ApiResponse for standardized responses
import { ApiResponse } from '../api-response.js';

import jwt from 'jsonwebtoken';

/**
 * Authentication middleware that verifies JWT and sets user info on req.user
 */
export const authenticate = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(
            ApiResponse.error('Authentication required. Please provide a valid token.')
        );
    }

    const token = authHeader.split(' ')[1];
    
    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request object
        req.user = {
            id: decoded.id || decoded.sub,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        console.error('JWT verification error:', error.message);
        return res.status(401).json(
            ApiResponse.error('Invalid token. Authentication failed.')
        );
    }
};

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
export const permit = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(
                ApiResponse.error('Authentication required.')
            );
        }

        if (roles.length === 0 || roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json(
                ApiResponse.error('Access denied. Insufficient permissions.')
            );
        }
    };
};

/**
 * Authorization middleware for students (DIKE or UMUM)
 */
export const authorizeStudents = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json(
            ApiResponse.error('Authentication required.')
        );
    }
    
    if (isStudent(req.user.role)) {
        next();
    } else {
        res.status(403).json(
            ApiResponse.error('Access denied. Student role required.')
        );
    }
};

/**
 * Permission-based authorization middleware
 * @param {string} permission - Required permission
 * @returns {Function} Express middleware
 */
export const permitWithPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(
                ApiResponse.error('Authentication required.')
            );
        }

        if (hasPermission(req.user.role, permission)) {
            next();
        } else {
            return res.status(403).json(
                ApiResponse.error(`Access denied. You don't have the required permission: ${permission}`)
            );
        }
    };
};

/**
 * Authorization middleware that permits access if it's the user's own resource or if user is admin
 * @param {Function} getUserIdFromRequest - Function to extract the target user ID from the request
 */
export const permitSelfOrAdmin = (getUserIdFromRequest) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(
                ApiResponse.error('Authentication required.')
            );
        }
        
        const targetUserId = getUserIdFromRequest(req);
        
        // Allow if admin or if it's user's own resource
        if (req.user.role === Roles.ADMIN || req.user.id === targetUserId) {
            next();
        } else {
            res.status(403).json(
                ApiResponse.error('Access denied. You can only access your own resources.')
            );
        }
    };
};

export { ApiResponse };