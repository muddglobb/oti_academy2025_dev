import express from 'express';
import * as enrollmentController from '../controllers/enrollment.controller.js';
import { authenticate, permit, authorizeStudents } from '../utils/rbac/index.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { verifyServiceToken } from '../middlewares/service-auth.middleware.js';

const router = express.Router();

router.post('/payment-approved', verifyServiceToken, asyncHandler(enrollmentController.processPaymentApproved));

router.get('/me', 
  authenticate, 
  permit('DIKE', 'UMUM', 'ADMIN'), 
  asyncHandler(enrollmentController.getMyEnrollments)
);

router.get('/isenrolled',
  authenticate, 
  permit('DIKE', 'UMUM', 'ADMIN'), 
  asyncHandler(enrollmentController.isUserEnrolled)
);

router.get('/:courseId/status', 
  authenticate, 
  permit('DIKE', 'UMUM', 'ADMIN'), 
  asyncHandler(enrollmentController.checkEnrollmentStatus)
);

router.get('/service/:courseId/status', 
  verifyServiceToken,
  asyncHandler(enrollmentController.checkEnrollmentStatus)
);

router.get('/service/user/:userId/isenrolled', 
  verifyServiceToken,
  asyncHandler(enrollmentController.isUserEnrolled)
);

router.get('/', 
  authenticate, 
  permit('ADMIN'), 
  asyncHandler(enrollmentController.getCourseEnrollments)
);



export default router;
