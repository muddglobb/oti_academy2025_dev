import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { CacheService } from './cache.service.js';
import { UserHelper } from '../utils/user-helper.js';
import { DateHelper } from '../utils/date-helper.js';

const prisma = new PrismaClient();

/**
 * Service for managing assignments in OTI Academy
 */
export class AssignmentService {
  /**
   * Create a new assignment
   * @param {Object} data - Assignment data
   * @returns {Promise<Object>} Created assignment
   */  static async createAssignment(data) {
    try {
      // Verify course exists
      const courseExists = await this.verifyCourse(data.courseId);
      if (!courseExists) {
        throw new Error('Course not found');
      }      
      
    // Konversi dueDate dari WIB (UTC+7) ke UTC jika ada
      let dueDateUTC = data.dueDate ? DateHelper.wibToUtc(data.dueDate) : null;
      
      console.log('📅 Original input dueDate:', data.dueDate);
      console.log('📅 Converted UTC dueDate:', dueDateUTC);
      console.log('📅 UTC ISO string:', dueDateUTC ? dueDateUTC.toISOString() : null);
      
      // Create assignment
      const assignment = await prisma.assignment.create({
        data: {
          title: data.title,
          description: data.description,
          courseId: data.courseId,
          dueDate: dueDateUTC ? dueDateUTC.toISOString() : null, // Menggunakan tanggal yang sudah dikonversi, pastikan dalam ISO string
          points: data.points || 100,
          resourceUrl: data.resourceUrl,
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
   */  static async getAssignmentById(id, includeSubmissions = false) {
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
      
      // Tambahkan format tanggal WIB untuk kebutuhan display
      if (assignment.dueDate) {
        assignment.dueDateWib = DateHelper.utcToWibString(assignment.dueDate, true);
        assignment.isPastDue = DateHelper.isPastDue(assignment.dueDate);
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
   */  static async getAssignmentsByCourse(courseId) {
    try {
      console.log(`🔄 Getting assignments for course: ${courseId}`);
      
      // Verify course exists
      const courseExists = await this.verifyCourse(courseId);
      if (!courseExists) {
        console.log(`❌ Course not found: ${courseId}`);
        throw new Error('Course not found');
      }

      console.log(`✅ Course verification successful: ${courseId}`);

      // Bypass cache for troubleshooting and get fresh data
      const assignments = await prisma.assignment.findMany({
        where: { 
          courseId,
          status: 'ACTIVE'
        },
        orderBy: { dueDate: 'asc' }
      });
      
      console.log(`📋 Found ${assignments.length} assignments for course ${courseId}`);
      
      // Add WIB date format for display
      const enhancedAssignments = assignments.map(assignment => {
        if (assignment.dueDate) {
          return {
            ...assignment,
            dueDateWib: DateHelper.utcToWibString(assignment.dueDate, true),
            isPastDue: DateHelper.isPastDue(assignment.dueDate)
          };
        }
        return assignment;
      });
      
      // Try to update cache, but don't let cache issues break the main functionality
      try {
        const cacheKey = `course-assignments-${courseId}`;
        // Invalidate any existing cache
        try {
          CacheService.invalidate(cacheKey);
        } catch (cacheError) {
          console.error(`Cache invalidation error (non-critical): ${cacheError.message}`);
        }
        
        // Set new cache
        try {
          CacheService.set(cacheKey, enhancedAssignments, 3600);
        } catch (cacheError) {
          console.error(`Cache setting error (non-critical): ${cacheError.message}`);
        }
      } catch (cacheError) {
        console.error(`Cache handling error (non-critical): ${cacheError.message}`);
      }
      
      return enhancedAssignments;
    } catch (error) {
      console.error(`❌ Error fetching assignments for course ${courseId}:`, error);
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
      
      // Process dueDate if it exists in the update data
      const updateData = { ...data };
      
      if (updateData.dueDate) {
        // Convert dueDate from WIB to UTC
        const dueDateUTC = DateHelper.wibToUtc(updateData.dueDate);
        console.log('📅 Update - Original input dueDate:', updateData.dueDate);
        console.log('📅 Update - Converted UTC dueDate:', dueDateUTC);
        
        // Make sure we store the date as ISO string
        updateData.dueDate = dueDateUTC.toISOString();
        console.log('📅 Update - Final UTC ISO string:', updateData.dueDate);
      }
      
      const updatedAssignment = await prisma.assignment.update({
        where: { id },
        data: updateData
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
  }  /**
   * Submit assignment solution
   * @param {Object} data - Submission data
   * @returns {Promise<Object>} Created submission
   */
  static async submitAssignment(data) {
    try {
      const { assignmentId, userId, fileUrl } = data;
      
      if (!fileUrl) {
        throw new Error('File URL is required');
      }
      
      // Validate file URL
      const { isValidFileUrl } = await import('./validators.js');
      if (!isValidFileUrl(fileUrl)) {
        throw new Error('Invalid file URL format');
      }
      
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
  // Grading functionality removed as per requirements
  /**
   * Update submission file URL
   * @param {string} submissionId - Submission ID
   * @param {string} userId - User ID (for verification)
   * @param {string} fileUrl - New file URL
   * @returns {Promise<Object>} Updated submission
   */
  static async updateSubmissionFileUrl(submissionId, userId, fileUrl) {
    try {
      // Check if fileUrl is provided
      if (!fileUrl) {
        throw new Error('File URL is required');
      }
      
      // Validate file URL
      const { isValidFileUrl } = await import('./validators.js');
      if (!isValidFileUrl(fileUrl)) {
        throw new Error('Invalid file URL format');
      }
      
      // Get the submission
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          assignment: {
            select: {
              dueDate: true,
              status: true
            }
          }
        }
      });
      
      if (!submission) {
        throw new Error('Submission not found');
      }
      
      // Check if user owns this submission
      if (submission.userId !== userId) {
        throw new Error('You can only update your own submissions');
      }
      
      // Check if assignment is still active
      if (submission.assignment.status !== 'ACTIVE') {
        throw new Error('Cannot update submission for inactive assignment');
      }
      
      // Check if due date has passed
      if (submission.assignment.dueDate && new Date() > new Date(submission.assignment.dueDate)) {
        throw new Error('Assignment due date has passed');
      }
      
      // Update the submission
      return await prisma.submission.update({
        where: { id: submissionId },
        data: {
          fileUrl,
          submittedAt: new Date(), // Update submission time
          status: 'SUBMITTED'
        }
      });
    } catch (error) {
      console.error(`Error updating submission file URL for ${submissionId}:`, error);
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
   * Get all assignments with pagination and optional filters
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} Assignments with pagination info
   */  static async getAllAssignments(options = {}) {
    try {
      const { 
        skip = 0, 
        limit = 10, 
        status = null, 
        courseId = null,
        searchTerm = null,
        orderBy = { dueDate: 'desc' }
      } = options;

      // Build where clause based on filters
      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      if (courseId) {
        where.courseId = courseId;
      }
      
      if (searchTerm) {
        where.OR = [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ];
      }
      
      // Get paginated results and total count
      const [assignments, total] = await Promise.all([
        prisma.assignment.findMany({
          where,
          include: {
            _count: {
              select: { submissions: true }
            }
          },
          orderBy,
          skip,
          take: limit
        }),
        prisma.assignment.count({ where })
      ]);
      
      // Tambahkan format WIB untuk due date
      const enhancedAssignments = assignments.map(assignment => {
        if (assignment.dueDate) {
          return {
            ...assignment,
            dueDateWib: DateHelper.utcToWibString(assignment.dueDate, true),
            isPastDue: DateHelper.isPastDue(assignment.dueDate)
          };
        }
        return assignment;
      });
      
      return {
        assignments: enhancedAssignments,
        pagination: {
          total,
          page: Math.floor(skip / limit) + 1,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching all assignments:', error);
      throw error;
    }
  }

  /**
   * Get all submissions with pagination and optional filters
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} Submissions with pagination info
   */
  static async getAllSubmissions(options = {}) {
    try {
      const { 
        skip = 0, 
        limit = 10, 
        status = null, 
        assignmentId = null,
        userId = null,
        orderBy = { submittedAt: 'desc' }
      } = options;

      // Build where clause based on filters
      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      if (assignmentId) {
        where.assignmentId = assignmentId;
      }
      
      if (userId) {
        where.userId = userId;
      }
      
      // Get paginated results and total count
      const [submissions, total] = await Promise.all([
        prisma.submission.findMany({
          where,
          include: {
            assignment: {
              select: {
                id: true,
                title: true,
                courseId: true,
                dueDate: true,
                points: true
              }
            }
          },
          orderBy,
          skip,
          take: limit
        }),
        prisma.submission.count({ where })
      ]);

      const enhancedSubmissions = await UserHelper.enhanceSubmissionsWithUserData(submissions);
      
      return {
        submissions: enhancedSubmissions,
        pagination: {
          total,
          page: Math.floor(skip / limit) + 1,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching all submissions:', error);
      throw error;
    }
  }

  /**
   * Get all submissions for a specific course with pagination
   * @param {string} courseId - Course ID
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} Submissions with pagination info
   */
  static async getSubmissionsByCourse(courseId, options = {}) {
    try {
      // Verify course exists
      const courseExists = await this.verifyCourse(courseId);
      if (!courseExists) {
        throw new Error('Course not found');
      }
      
      const { 
        skip = 0, 
        limit = 10, 
        status = null,
        userId = null,
        orderBy = { submittedAt: 'desc' }
      } = options;
      
      // Find all assignments for this course
      const assignments = await prisma.assignment.findMany({
        where: { courseId },
        select: { id: true }
      });
      
      if (assignments.length === 0) {
        return {
          submissions: [],
          pagination: {
            total: 0,
            page: 1,
            limit,
            pages: 0
          }
        };
      }
      
      const assignmentIds = assignments.map(assignment => assignment.id);
      
      // Build where clause
      const where = {
        assignmentId: { in: assignmentIds }
      };
      
      if (status) {
        where.status = status;
      }
      
      if (userId) {
        where.userId = userId;
      }
      
      // Get paginated submissions and total count
      const [submissions, total] = await Promise.all([
        prisma.submission.findMany({
          where,
          include: {
            assignment: {
              select: {
                id: true,
                title: true,
                courseId: true,
                dueDate: true,
                points: true
              }
            }
          },
          orderBy,
          skip,
          take: limit
        }),
        prisma.submission.count({ where })
      ]);
      
      // Enhance submissions with user data and WIB date format
      const enhancedSubmissions = await UserHelper.enhanceSubmissionsWithUserData(submissions);
      
      // Add WIB date format to each submission's assignment
      const finalSubmissions = enhancedSubmissions.map(submission => {
        if (submission.assignment && submission.assignment.dueDate) {
          return {
            ...submission,
            assignment: {
              ...submission.assignment,
              dueDateWib: DateHelper.utcToWibString(submission.assignment.dueDate, true)
            }
          };
        }
        return submission;
      });
      
      return {
        submissions: finalSubmissions,
        pagination: {
          total,
          page: Math.floor(skip / limit) + 1,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error(`Error fetching submissions for course ${courseId}:`, error);
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
  }  /**
   * Verify user is enrolled in course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<boolean>} Whether user is enrolled
   */
  static async verifyEnrollment(userId, courseId) {
    try {
      const paymentServiceUrl = config.PAYMENT_SERVICE_URL || 'http://payment-service:8006';
      const serviceToken = this.generateServiceToken();
      
      // Untuk komunikasi service-to-service, kita kirimkan userId sebagai header khusus
      // Ini memastikan keamanan dan tidak mencampur dengan user yang login via frontend
      const response = await axios.get(
        `${paymentServiceUrl}/enrollments/${courseId}/status`,
        { 
          headers: { 
            'Authorization': `Bearer ${serviceToken}`,
            'X-User-ID': userId // Mengirim userId sebagai header khusus
          },
          timeout: 5000
        }
      );
      
      return response.data && 
             response.data.status === 'success' && 
             response.data.data && 
             response.data.data.isEnrolled === true;
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