/**
 * Re-export RBAC modules untuk konsistensi antar service
 */
export { 
    authenticate, 
    authorizeRoles,
    authorizeStudents,
    ApiResponse
  } from '../middleware/auth.middleware.js';
  
  export { Roles } from '../libs/roles.js';