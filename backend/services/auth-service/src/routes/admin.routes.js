import { Router } from 'express';
import { importDikeStudents } from '../controllers/admin.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';
import { uploadCSV } from '../utils/upload.util.js';
import { asyncHandler } from '../middleware/async.middleware.js';

const router = Router();

// Protected routes - admin only
router.post('/import-dike-students', 
  authenticateJWT, 
  authorizeRoles('ADMIN'),
  (req, res, next) => {
    uploadCSV(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      next();
    });
  },
  importDikeStudents
);

export default router;