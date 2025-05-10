import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/rbac/index.js';
const prisma = new PrismaClient();

/**
 * Enrollment Service
 * Handles business logic for enrollment operations
 */
class EnrollmentService {
  /**
   * Enroll a user to multiple courses (typically from a bundle)
   * @param {string} userId - The ID of the user to enroll
   * @param {string} packageId - The optional ID of the package/bundle
   * @param {string[]} courseIds - Array of course IDs to enroll the user in
   * @returns {Promise<Array>} - Array of created/updated enrollments
   */
  async enrollUserToCourses(userId, packageId, courseIds) {
    const enrollments = [];

    for (const courseId of courseIds) {
      try {
        const enrollment = await prisma.enrollment.upsert({
          where: { 
            userId_courseId: { 
              userId, 
              courseId 
            } 
          },
          update: {}, // If it exists, we don't need to update anything
          create: { 
            userId, 
            courseId, 
            packageId 
          },
        });
        
        enrollments.push(enrollment);
      } catch (error) {
        console.error(`Error enrolling user ${userId} in course ${courseId}:`, error);
        // Continue with other enrollments even if one fails
      }
    }

    return enrollments;
  }

  /**
   * Get all enrollments for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} - Array of enrollment records with course details
   */  async getUserEnrollments(userId) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId
      }
    });

    return enrollments.map(enrollment => ({
      id: enrollment.id,
      courseId: enrollment.courseId,
      packageId: enrollment.packageId,
      createdAt: enrollment.createdAt,
      isEnrolled: true // Always true since these are enrolled courses
    }));
  }

  /**
   * Check if a user is enrolled in a specific course
   * @param {string} userId - The ID of the user
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Object>} - Object with isEnrolled flag
   */
  async checkEnrollmentStatus(userId, courseId) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    return {
      isEnrolled: !!enrollment
    };
  }

  /**
   * Get all users enrolled in a specific course (for admin)
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Array>} - Array of enrollment records with user details
   */  
  async getCourseEnrollments(courseId) {
    return prisma.enrollment.findMany({
      where: {
        courseId: courseId
      }
    });
  }

  /**
   * Get all enrollments (for admin)
   * @returns {Promise<Array>} - Array of all enrollment records
   */
  async getAllEnrollments() {
    return prisma.enrollment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  
  async isUserEnrolled(userId, courseId) {
    const enrollment = await prisma.enrollment.count({
      where:{
        userId
      }
    });

    return enrollment > 0;
  }
}

export default new EnrollmentService();
