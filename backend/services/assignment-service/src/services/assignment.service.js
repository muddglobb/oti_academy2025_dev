import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { CacheService } from './cache.service.js';

const prisma = new PrismaClient();

/**
 * Service for managing assignments in OTI Academy
 */
export class AssignmentService {
  /**
   * Create a new assignment
   * @param {Object} data - Assignment data
   * @returns {Promise<Object>} Created assignment
   */
  static async createAssignment(data) {
    try {
      // Verify course exists
      const courseExists = await this.verifyCourse(data.courseId);
      if (!courseExists) {
        throw new Error('Course not found');
      }

      // Create assignment
      const assignment = await prisma.assignment.create({
        data: {
          title: data.title,
          description: data.description,
          courseId: data.courseId,
          dueDate: data.dueDate,
          points: data.points || 100,
          status: 'ACTIVE'
        }
      });

      return assignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }

  /**
   * Get assignment by ID with optional submission data
   * @param {string} id - Assignment ID
   * @param {boolean} includeSubmissions - Whether to include submissions
   * @returns {Promise<Object>} Assignment with optional submissions
   */
  static async getAssignmentById(id, includeSubmissions = false) {
    try {
      const assignment = await prisma.assignment.findUnique({
        where: { id },
        include: {
          submissions: includeSubmissions
        }
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      return assignment;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all assignments for a course
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} List of assignments
   */
  static async getAssignmentsByCourse(courseId) {
    try {
      // Verify course exists
      const courseExists = await this.verifyCourse(courseId);
      if (!courseExists) {
        throw new Error('Course not found');
      }

      // Cache key based on course ID
      const cacheKey = `course-assignments-${courseId}`;

      // Try to get from cache first
      return await CacheService.getOrSet(
        cacheKey,
        async () => {
          return prisma.assignment.findMany({
            where: { 
              courseId,
              status: 'ACTIVE'
            },
            orderBy: { dueDate: 'asc' }
          });
        },
        3600 // Cache for 1 hour
      );
    } catch (error) {
      console.error(`Error fetching assignments for course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Update assignment
   * @param {string} id - Assignment ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated assignment
   */
  static async updateAssignment(id, data) {
    try {
      const assignment = await this.getAssignmentById(id);
      
      const updatedAssignment = await prisma.assignment.update({
        where: { id },
        data
      });

      // Invalidate cache
      await CacheService.invalidate(`course-assignments-${assignment.courseId}`, false);
      
      return updatedAssignment;
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete assignment (soft delete)
   * @param {string} id - Assignment ID
   * @returns {Promise<Object>} Deleted assignment
   */
  static async deleteAssignment(id) {
    try {
      const assignment = await this.getAssignmentById(id);
      
      // Check if it has submissions
      const submissionCount = await prisma.submission.count({
        where: { assignmentId: id }
      });
      
      if (submissionCount > 0) {
        // Soft delete if there are submissions
        const deletedAssignment = await prisma.assignment.update({
          where: { id },
          data: { status: 'DELETED' }
        });
        
        // Invalidate cache
        await CacheService.invalidate(`course-assignments-${assignment.courseId}`, false);
        
        return deletedAssignment;
      } else {
        // Hard delete if no submissions
        const deletedAssignment = await prisma.assignment.delete({
          where: { id }
        });
        
        // Invalidate cache
        await CacheService.invalidate(`course-assignments-${assignment.courseId}`, false);
        
        return deletedAssignment;
      }
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Submit assignment solution
   * @param {Object} data - Submission data
   * @returns {Promise<Object>} Created submission
   */
  static async submitAssignment(data) {
    try {
      const { assignmentId, userId, content, fileUrl } = data;
      
      // Verify assignment exists and is active
      const assignment = await prisma.assignment.findFirst({
        where: { 
          id: assignmentId,
          status: 'ACTIVE'
        }
      });
      
      if (!assignment) {
        throw new Error('Assignment not found or inactive');
      }
      
      // Check if due date has passed
      if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
        throw new Error('Assignment due date has passed');
      }
      
      // Check if student is enrolled in the course
      const isEnrolled = await this.verifyEnrollment(userId, assignment.courseId);
      if (!isEnrolled) {
        throw new Error('You are not enrolled in this course');
      }
      
      // Check for existing submission
      const existingSubmission = await prisma.submission.findFirst({
        where: {
          assignmentId,
          userId
        }
      });
      
      if (existingSubmission) {
        // Update existing submission
        return await prisma.submission.update({
          where: { id: existingSubmission.id },
          data: {
            content,
            fileUrl,
            submittedAt: new Date(),
            status: 'SUBMITTED'
          }
        });
      } else {
        // Create new submission
        return await prisma.submission.create({
          data: {
            assignmentId,
            userId,
            content,
            fileUrl,
            submittedAt: new Date(),
            status: 'SUBMITTED'
          }
        });
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  }

  /**
   * Grade a submission
   * @param {string} submissionId - Submission ID
   * @param {Object} data - Grading data
   * @returns {Promise<Object>} Updated submission
   */
  static async gradeSubmission(submissionId, data) {
    try {
      const { score, feedback } = data;
      
      // Validate submission exists
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId }
      });
      
      if (!submission) {
        throw new Error('Submission not found');
      }
      
      // Validate score
      if (score < 0 || score > 100) {
        throw new Error('Score must be between 0 and 100');
      }
      
      // Update submission with grade
      return await prisma.submission.update({
        where: { id: submissionId },
        data: {
          score,
          feedback,
          status: 'GRADED',
          gradedAt: new Date()
        }
      });
    } catch (error) {
      console.error(`Error grading submission ${submissionId}:`, error);
      throw error;
    }
  }

  /**
   * Get submissions for a specific assignment
   * @param {string} assignmentId - Assignment ID
   * @returns {Promise<Array>} List of submissions
   */
  static async getSubmissionsByAssignment(assignmentId) {
    try {
      // Verify assignment exists
      const assignment = await this.getAssignmentById(assignmentId);
      
      // Get all submissions for this assignment
      return await prisma.submission.findMany({
        where: { assignmentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' }
      });
    } catch (error) {
      console.error(`Error fetching submissions for assignment ${assignmentId}:`, error);
      throw error;
    }
  }

  /**
   * Get submissions for a specific student
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of submissions
   */
  static async getStudentSubmissions(userId) {
    try {
      return await prisma.submission.findMany({
        where: { userId },
        include: {
          assignment: true
        },
        orderBy: { submittedAt: 'desc' }
      });
    } catch (error) {
      console.error(`Error fetching submissions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Verify course exists in course service
   * @param {string} courseId - Course ID
   * @returns {Promise<boolean>} Whether course exists
   */
  static async verifyCourse(courseId) {
    try {
      const courseServiceUrl = config.COURSE_SERVICE_URL || 'http://course-service:8002';
      const serviceToken = this.generateServiceToken();
      
      const response = await axios.get(
        `${courseServiceUrl}/courses/${courseId}`,
        { 
          headers: { 'Authorization': `Bearer ${serviceToken}` },
          timeout: 5000 
        }
      );
      
      return response.data && response.data.status === 'success';
    } catch (error) {
      console.error(`Error verifying course ${courseId}:`, error.message);
      return false;
    }
  }

  /**
   * Verify user is enrolled in course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<boolean>} Whether user is enrolled
   */
  static async verifyEnrollment(userId, courseId) {
    try {
      const enrollmentServiceUrl = config.ENROLLMENT_SERVICE_URL || 'http://enrollment-service:8007';
      const serviceToken = this.generateServiceToken();
      
      const response = await axios.get(
        `${enrollmentServiceUrl}/enrollments/verify`,
        { 
          params: { userId, courseId },
          headers: { 'Authorization': `Bearer ${serviceToken}` },
          timeout: 5000
        }
      );
      
      return response.data && response.data.status === 'success' && response.data.data.enrolled === true;
    } catch (error) {
      console.error(`Error verifying enrollment for user ${userId} in course ${courseId}:`, error.message);
      return false;
    }
  }

  /**
   * Generate JWT token for service-to-service communication
   * @returns {string} JWT token
   */
  static generateServiceToken() {
    const payload = {
      service: 'assignment-service',
      role: 'SERVICE'
    };
    
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
  }
}