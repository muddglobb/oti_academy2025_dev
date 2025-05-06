/**
 * Re-export RBAC modules yang sudah disalin ke dalam package-service
 */
export { 
  authenticate, 
  permit,
  permitWithPermission,
  permitSelfOrAdmin,
  Roles,
  Permissions,
  hasPermission,
  ApiResponse
} from '../utils/rbac/index.js';