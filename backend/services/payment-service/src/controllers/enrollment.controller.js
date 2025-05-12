import { EnrollmentService } from '../services/enrollment.service.js';
import { ApiResponse } from '../utils/api-response.js';

/**
 * Get user's enrollments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserEnrollments = async (req, res) => {
  try {
    // Get user ID from JWT token
    const userId = req.user.id;
    
    const enrollments = await EnrollmentService.getEnrollmentsByUserId(userId);
      // Enhance enrollments with course information
    const enhancedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        try {
          // Import dynamically to avoid circular dependencies
          const { PaymentService } = await import('../services/payment.service.js');
          const { CourseService } = await import('../services/course.service.js');
          
          let courseInfo = null;
          
          // Try using PaymentService.getCourseInfo if available
          if (typeof PaymentService.getCourseInfo === 'function') {
            courseInfo = await PaymentService.getCourseInfo(enrollment.courseId);
          } else {
            // Fallback to direct CourseService call
            courseInfo = await CourseService.getCourseById(enrollment.courseId);
          }
          
          return {
            ...enrollment,
            course: courseInfo || { id: enrollment.courseId, title: 'Unknown Course' }
          };
        } catch (error) {
          console.error(`Error fetching course info for ${enrollment.courseId}:`, error.message);
          return {
            ...enrollment,
            course: { id: enrollment.courseId, title: 'Unknown Course' }
          };
        }
      })
    );
    
    res.status(200).json(
      ApiResponse.success(enhancedEnrollments, 'User enrollments retrieved successfully')
    );
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    res.status(500).json(
      ApiResponse.error('An error occurred while retrieving user enrollments')
    );
  }
};

/**
 * Get enrollment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const enrollment = await EnrollmentService.getEnrollmentById(id);
    
    if (!enrollment) {
      return res.status(404).json(
        ApiResponse.error('Enrollment not found')
      );
    }
    
    // Check if the enrollment belongs to the user
    if (enrollment.userId !== userId) {
      return res.status(403).json(
        ApiResponse.error('You do not have permission to access this enrollment')
      );
    }
      let courseInfo = null;
    
    try {
      // Import dynamically to avoid circular dependencies
      const { PaymentService } = await import('../services/payment.service.js');
      const { CourseService } = await import('../services/course.service.js');
      
      // Try using PaymentService.getCourseInfo if available
      if (typeof PaymentService.getCourseInfo === 'function') {
        courseInfo = await PaymentService.getCourseInfo(enrollment.courseId);
      } else {
        // Fallback to direct CourseService call
        courseInfo = await CourseService.getCourseById(enrollment.courseId);
      }
    } catch (error) {
      console.error(`Error fetching course info for ${enrollment.courseId}:`, error.message);
    }
    
    const enhancedEnrollment = {
      ...enrollment,
      course: courseInfo || { id: enrollment.courseId, title: 'Unknown Course' }
    };
    
    res.status(200).json(
      ApiResponse.success(enhancedEnrollment, 'Enrollment retrieved successfully')
    );
  } catch (error) {
    console.error('Error getting enrollment:', error);
    res.status(500).json(
      ApiResponse.error('An error occurred while retrieving the enrollment')
    );
  }
};

/**
 * Check if user is enrolled in a course
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    
    const isEnrolled = await EnrollmentService.isUserEnrolled(userId, courseId);
    
    res.status(200).json(
      ApiResponse.success({ isEnrolled }, 'Enrollment status checked successfully')
    );
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    res.status(500).json(
      ApiResponse.error('An error occurred while checking enrollment status')
    );
  }
};

/**
 * Update enrollment progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;
    
    // Check if the enrollment exists
    const enrollment = await EnrollmentService.getEnrollmentById(id);
    
    if (!enrollment) {
      return res.status(404).json(
        ApiResponse.error('Enrollment not found')
      );
    }
    
    // Check if the enrollment belongs to the user
    if (enrollment.userId !== userId) {
      return res.status(403).json(
        ApiResponse.error('You do not have permission to update this enrollment')
      );
    }
    
    // Validate progress value
    const progressValue = parseFloat(progress);
    if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
      return res.status(400).json(
        ApiResponse.error('Progress must be a number between 0 and 100')
      );
    }
    
    // Update the progress
    const updatedEnrollment = await EnrollmentService.updateProgress(id, progressValue);
    
    res.status(200).json(
      ApiResponse.success(updatedEnrollment, 'Enrollment progress updated successfully')
    );
  } catch (error) {
    console.error('Error updating enrollment progress:', error);
    res.status(500).json(
      ApiResponse.error('An error occurred while updating enrollment progress')
    );
  }
};

/**
 * Get all enrollments (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllEnrollments = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json(
        ApiResponse.error('You do not have permission to access all enrollments')
      );
    }
    
    // Parse query parameters for filtering
    const {
      status,
      userId,
      courseId,
      packageId,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;
    
    // Parse page and limit as numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Validate page and limit
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json(
        ApiResponse.error('Page must be a positive number')
      );
    }
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json(
        ApiResponse.error('Limit must be between 1 and 100')
      );
    }
    
    // Prepare filters
    const filters = {
      status,
      userId,
      courseId,
      packageId,
      startDate,
      endDate
    };
    
    // Get enrollments
    const result = await EnrollmentService.getAllEnrollments(filters, pageNum, limitNum);
      // Enhance enrollments with course information
    const enhancedEnrollments = await Promise.all(
      result.enrollments.map(async (enrollment) => {
        // Import dynamically to avoid circular dependencies
        const { PaymentService } = await import('../services/payment.service.js');
        const { CourseService } = await import('../services/course.service.js');
        
        let courseInfo = null;
        try {
          // Try using PaymentService.getCourseInfo if available
          if (typeof PaymentService.getCourseInfo === 'function') {
            courseInfo = await PaymentService.getCourseInfo(enrollment.courseId);
          } else {
            // Fallback to direct CourseService call
            courseInfo = await CourseService.getCourseById(enrollment.courseId);
          }
        } catch (error) {
          console.error(`Error fetching course info for ${enrollment.courseId}:`, error.message);
        }
        
        const userInfo = await PaymentService.getUserInfo(enrollment.userId);
        
        return {
          ...enrollment,
          course: courseInfo || { id: enrollment.courseId, title: 'Unknown Course' },
          user: userInfo ? {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email
          } : { id: enrollment.userId, name: 'Unknown User' }
        };
      })
    );
    
    res.status(200).json(
      ApiResponse.success(
        {
          enrollments: enhancedEnrollments,
          pagination: result.pagination
        },
        'Enrollments retrieved successfully'
      )
    );
  } catch (error) {
    console.error('Error getting all enrollments:', error);
    res.status(500).json(
      ApiResponse.error('An error occurred while retrieving enrollments')
    );
  }
};

/**
 * Check if user is enrolled in any course
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const checkIsEnrolled = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const enrollmentStatus = await EnrollmentService.checkIsUserEnrolled(userId);
    
    res.status(200).json(
      ApiResponse.success(
        enrollmentStatus, 
        'Enrollment status checked successfully'
      )
    );
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    res.status(500).json(
      ApiResponse.error('An error occurred while checking enrollment status')
    );
  }
};
