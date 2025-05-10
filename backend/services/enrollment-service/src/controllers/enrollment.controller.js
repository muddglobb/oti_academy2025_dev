import enrollmentService from '../services/enrollment.service.js';
import { ApiResponse } from '../utils/rbac/index.js';

/**
 * Process enrollments after payment approval
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function processPaymentApproved(req, res) {
  const { userId, packageId, courseIds } = req.body;

  if (!userId || !courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
    return res.status(400).json(
      ApiResponse.error('Invalid request parameters. Required: userId and non-empty courseIds array.')
    );
  }

  const enrollments = await enrollmentService.enrollUserToCourses(userId, packageId, courseIds);

  return res.status(201).json(
    ApiResponse.success('User enrolled in courses successfully', { enrollments })
  );
}

/**
 * Get enrollments for the currently authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getMyEnrollments(req, res) {
  const userId = req.user.id;
  
  const enrollments = await enrollmentService.getUserEnrollments(userId);

  return res.status(200).json(
    ApiResponse.success('User enrollments retrieved successfully', { enrollments })
  );
}

/**
 * Check enrollment status for a specific course
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function checkEnrollmentStatus(req, res) {
  const userId = req.user.id;
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json(
      ApiResponse.error('Course ID is required')
    );
  }

  const status = await enrollmentService.checkEnrollmentStatus(userId, courseId);

  return res.status(200).json(
    ApiResponse.success('Enrollment status retrieved successfully', status)
  );
}

/**
 * Get all enrollments for a specific course or all enrollments if no courseId (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getCourseEnrollments(req, res) {
  const { courseId } = req.query;
  let enrollments;
  
  if (courseId) {
    // Get enrollments for a specific course
    enrollments = await enrollmentService.getCourseEnrollments(courseId);
    return res.status(200).json(
      ApiResponse.success('Course enrollments retrieved successfully', { enrollments })
    );
  } else {
    // Get all enrollments (admin only)
    enrollments = await enrollmentService.getAllEnrollments();
    return res.status(200).json(
      ApiResponse.success('All enrollments retrieved successfully', { enrollments })
    );
  }
}


export async function isUserEnrolled(req, res){
  try{
  const userId = req.user.id || req.params.userId;

  if (!userId) {
    return res.status(400).json(
      ApiResponse.error('User ID is required')
    );
  }

  const isEnrolled = await enrollmentService.isUserEnrolled(userId);
  return res.status(200).json(
    ApiResponse.success('User enrollment status retrieved successfully', { isEnrolled })
  );
  }catch (error) {
    console.error('Error checking user enrollment status:', error);
    return res.status(500).json(
      ApiResponse.error('Failed to check user enrollment status')
    );
  }
}



