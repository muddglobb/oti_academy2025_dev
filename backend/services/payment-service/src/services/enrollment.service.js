import { PrismaClient } from '@prisma/client';
import { sendEnrollmentConfirmationEmail } from '../utils/email-helper.js';

const prisma = new PrismaClient();

/**
 * Enrollment Service - Handles all database operations related to enrollments
 */
export class EnrollmentService {
  /**
   * Create a new enrollment
   * @param {Object} enrollmentData - Enrollment data
   * @returns {Promise<Object>} Created enrollment
   */
  static async createEnrollment(enrollmentData) {
    return prisma.enrollment.create({
      data: enrollmentData
    });
  }

  /**
   * Create multiple enrollments in a transaction
   * @param {Array} enrollmentsData - Array of enrollment data objects
   * @returns {Promise<Array>} Created enrollments
   */
  static async createManyEnrollments(enrollmentsData) {
    return prisma.$transaction(
      enrollmentsData.map(data => 
        prisma.enrollment.create({ data })
      )
    );
  }

  /**
   * Get enrollments by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User's enrollments
   */
  static async getEnrollmentsByUserId(userId) {
    return prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get enrollment by ID
   * @param {string} id - Enrollment ID
   * @returns {Promise<Object>} Enrollment
   */
  static async getEnrollmentById(id) {
    return prisma.enrollment.findUnique({
      where: { id }
    });
  }

  /**
   * Check if a user is enrolled in a course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<boolean>} Whether the user is enrolled
   */
  static async isUserEnrolled(userId, courseId) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: 'ENROLLED'
      }
    });

    return !!enrollment;
  }

  /**
   * Get enrollment by user ID and course ID
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} Enrollment
   */
  static async getEnrollmentByUserAndCourse(userId, courseId) {
    return prisma.enrollment.findFirst({
      where: {
        userId,
        courseId
      }
    });
  }

  /**
   * Update enrollment progress
   * @param {string} id - Enrollment ID
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Promise<Object>} Updated enrollment
   */
  static async updateProgress(id, progress) {
    return prisma.enrollment.update({
      where: { id },
      data: { progress }
    });
  }

  /**
   * Process enrollments after a payment is approved
   * @param {Object} payment - Payment object
   * @param {Array} courseIds - Array of course IDs to enroll
   * @returns {Promise<Object>} Result with created enrollments
   */
  static async processEnrollment(payment, courseIds) {
    try {
      // Import PaymentService dynamically to avoid circular dependencies
      const { PaymentService } = await import('./payment.service.js');
      
      // If no courseIds provided, try to determine from payment and package
      if (!courseIds || courseIds.length === 0) {
        // Get package info to determine if it's a bundle
        const packageInfo = await PaymentService.getPackageInfo(payment.packageId);
        const isBundle = packageInfo && packageInfo.type === 'BUNDLE';
        
        if (isBundle) {
          // For bundle packages, get all courses in the package
          const coursesInBundle = await PaymentService.getCoursesInPackage(payment.packageId);
          
          if (coursesInBundle && Array.isArray(coursesInBundle)) {
            courseIds = coursesInBundle.map(course => course.id || course.courseId).filter(Boolean);
          }
        } else if (payment.courseId) {
          // For individual courses, use the courseId from the payment
          courseIds = [payment.courseId];
        }
      }
      
      if (!courseIds || courseIds.length === 0) {
        throw new Error('No courses found for enrollment');
      }
      
      console.log(`Processing enrollment for user ${payment.userId} in ${courseIds.length} courses`);
      
      // Prepare enrollment data for each course
      const enrollmentsData = courseIds.map(courseId => ({
        userId: payment.userId,
        courseId,
        paymentId: payment.id,
        packageId: payment.packageId,
        status: 'ENROLLED'
      }));
      
      // Create all enrollments in a transaction
      const enrollments = await this.createManyEnrollments(enrollmentsData);
      
      console.log(`Created ${enrollments.length} enrollments for payment ${payment.id}`);
      
      // Get user info and package info for email
      const userInfo = await PaymentService.getUserInfo(payment.userId);
      const packageInfo = await PaymentService.getPackageInfo(payment.packageId);
      
      // Get course names for email
      const courseNames = await Promise.all(courseIds.map(async (courseId) => {
        try {
          const courseInfo = await PaymentService.getCourseInfo(courseId);
          return courseInfo?.title || 'Unknown Course';
        } catch (error) {
          console.error(`Error getting course title for ${courseId}:`, error.message);
          return 'Unknown Course';
        }
      }));
      
      // Send enrollment confirmation email
      try {
        await sendEnrollmentConfirmationEmail(payment, userInfo, packageInfo, courseNames);
      } catch (emailError) {
        console.error('Failed to send enrollment confirmation email:', emailError.message);
        // Continue anyway since enrollment was successful
      }
      
      return {
        status: 'enrolled',
        message: 'User enrolled in courses successfully',
        enrollments
      };
    } catch (error) {
      console.error('Error processing enrollment:', error.message);
      throw error;
    }
  }

  /**
   * Get all enrollments with optional filtering and pagination
   * @param {Object} filters - Optional filters (status, userId, courseId, etc.)
   * @param {number} page - Page number
   * @param {number} limit - Limit per page
   * @returns {Promise<Object>} Paginated enrollments
   */
  static async getAllEnrollments(filters = {}, page = 1, limit = 10) {
    const {
      status,
      userId,
      courseId,
      packageId,
      startDate,
      endDate
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};
    
    // Apply filters
    if (status) {
      where.status = status;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (courseId) {
      where.courseId = courseId;
    }
    
    if (packageId) {
      where.packageId = packageId;
    }
    
    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Get paginated results and total count
    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          payment: true
        }
      }),
      prisma.enrollment.count({ where })
    ]);

    return {
      enrollments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Check if a user is enrolled in any course
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Enrollment status
   */
  static async checkIsUserEnrolled(userId) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        status: 'ENROLLED'
      }
    });

    return {
      isEnrolled: !!enrollment,
      enrollmentCount: enrollment ? await prisma.enrollment.count({
        where: {
          userId,
          status: 'ENROLLED'
        }
      }) : 0
    };
  }
}
