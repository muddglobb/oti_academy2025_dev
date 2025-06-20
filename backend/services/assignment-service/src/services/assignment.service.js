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
   * Helper function to format assignment response with WIB timezone
   * @param {Object} assignment - Assignment object
   * @returns {Object} Formatted assignment with WIB dates
   */
  static formatAssignmentResponse(assignment) {
    if (!assignment) return assignment;
    
    const formattedAssignment = { ...assignment };
    
    // Convert dueDate from UTC to WIB
    if (assignment.dueDate) {
      const utcDate = new Date(assignment.dueDate);
      
      // Add 7 hours to convert UTC to WIB
      const wibDate = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));
      
      // Return as ISO string with +07:00 timezone indicator
      formattedAssignment.dueDate = wibDate.toISOString().replace('Z', '+07:00');
      
      // Keep the existing dueDateWib for human-readable format
      formattedAssignment.dueDateWib = DateHelper.utcToWibString(utcDate, true);
      
      // Real-time isPastDue calculation using original UTC time
      formattedAssignment.isPastDue = DateHelper.isPastDue(utcDate);
    } else {
      formattedAssignment.isPastDue = false;
    }
    
    return formattedAssignment;
  }

  /**
   * Create a new assignment
   * @param {Object} data - Assignment data
   * @returns {Promise<Object>} Created assignment
   */  static async createAssignment(data) {
    try {      // Verify course exists
      const courseExists = await this.verifyCourse(data.courseId);
      if (!courseExists) {
        throw new Error('Course not found');
      }      
      
      // Process dueDate - langsung gunakan input tanggal karena database sudah diset timezone Asia/Jakarta
      let processedDueDate = null;
      if (data.dueDate) {
        // Pastikan format tanggal valid
        processedDueDate = new Date(data.dueDate);
        if (isNaN(processedDueDate.getTime())) {
          throw new Error('Invalid due date format');
        }
      }
        console.log('📅 Original input dueDate:', data.dueDate);
      console.log('📅 Processed dueDate:', processedDueDate);
      console.log('📅 Final ISO string:', processedDueDate ? processedDueDate.toISOString() : null);
        // ✅ PRE-INVALIDATE CACHE - Before creating assignment
      console.log(`🧹 Pre-invalidating cache for course: ${data.courseId}`);
      try {
        const preInvalidateResult = await CacheService.invalidate(`course-assignments-${data.courseId}`, false);
        console.log(`🧹 Pre-invalidation result: ${preInvalidateResult}`);
      } catch (cacheError) {
        console.error('Pre-cache invalidation error (non-critical):', cacheError.message);
      }
      
      // ✅ Use transaction to ensure consistency
      console.log('🧪 Starting database transaction...');
      const assignment = await prisma.$transaction(async (tx) => {
        const newAssignment = await tx.assignment.create({
          data: {
            title: data.title,
            description: data.description,
            courseId: data.courseId,
            dueDate: processedDueDate ? processedDueDate.toISOString() : null,
            points: data.points || 100,
            resourceUrl: data.resourceUrl,
            status: 'ACTIVE'
          }
        });
        
        console.log('🧪 Assignment created in transaction:', newAssignment.id);
        
        // Verify it's really there within the transaction
        const verification = await tx.assignment.findUnique({
          where: { id: newAssignment.id }
        });
        
        if (!verification) {
          throw new Error('Transaction verification failed - assignment not found after creation');
        }
        
        console.log('🧪 Transaction verification passed');
        return newAssignment;
      });

      console.log(`✅ Assignment created successfully with transaction: ${assignment.id} for course: ${data.courseId}`);

      // ✅ IMMEDIATE VERIFICATION - Check if assignment exists in database
      console.log('🧪 Immediate verification - checking if assignment exists in database...');
      try {
        const verificationQuery = await prisma.assignment.findUnique({
          where: { id: assignment.id }
        });
        console.log('🧪 Verification result:', verificationQuery ? 'FOUND' : 'NOT FOUND');

        if (verificationQuery) {
          console.log('🧪 Verified assignment data:', {
            id: verificationQuery.id,
            title: verificationQuery.title,
            status: verificationQuery.status,
            courseId: verificationQuery.courseId,
            createdAt: verificationQuery.createdAt
          });
        }

        // ✅ TEST getAllAssignments immediately after create
        console.log('🧪 Testing getAllAssignments immediately after create...');
        const allAssignmentsAfterCreate = await this.getAllAssignments();
        const foundInGetAll = allAssignmentsAfterCreate.find(a => a.id === assignment.id);
        console.log('🧪 Assignment found in getAllAssignments:', foundInGetAll ? 'YES' : 'NO');
        
        if (!foundInGetAll) {
          console.log('🧪 Assignment NOT found in getAllAssignments! Debugging...');
          console.log('🧪 Total assignments returned by getAllAssignments:', allAssignmentsAfterCreate.length);
          console.log('🧪 Assignment IDs from getAllAssignments:', allAssignmentsAfterCreate.map(a => a.id));
        }
      } catch (verificationError) {
        console.error('🧪 Verification error:', verificationError.message);
      }      // ✅ POST-INVALIDATE CACHE - After creating assignment
      console.log(`🔄 Post-invalidating cache for course: ${data.courseId}`);
      try {
        // ✅ Check cache before invalidation
        const beforeCache = await CacheService.get(`course-assignments-${data.courseId}`);
        console.log(`🧪 Cache before invalidation: ${beforeCache ? `${beforeCache.length} items` : 'null'}`);
        
        // ✅ Invalidate course-specific cache
        const postInvalidateResult = await CacheService.invalidate(`course-assignments-${data.courseId}`, false);
        console.log(`🔄 Post-invalidation result: ${postInvalidateResult}`);
        
        // ✅ TAMBAHKAN: Invalidate all-assignments cache juga
        console.log('🧹 Invalidating all-assignments cache pattern...');
        await CacheService.invalidate('all-assignments', true); // Pattern invalidation
        console.log('✅ All-assignments cache pattern invalidated');
        
        // ✅ Verify cache is actually cleared
        const afterCache = await CacheService.get(`course-assignments-${data.courseId}`);
        console.log(`🧪 Cache after invalidation: ${afterCache ? `${afterCache.length} items - FAILED TO CLEAR!` : 'null - SUCCESS'}`);
        
        // ✅ If cache still exists, force clear all cache
        if (afterCache) {
          console.log(`⚠️ Cache still exists! Forcing clear all cache...`);
          await CacheService.clearAll();
          const finalCheck = await CacheService.get(`course-assignments-${data.courseId}`);
          console.log(`🧪 Final cache check: ${finalCheck ? 'STILL EXISTS' : 'CLEARED'}`);
        }
      } catch (cacheError) {
        console.error('Post-cache invalidation error (non-critical):', cacheError.message);
      }

      // ✅ FORCE CLEAR ALL ASSIGNMENT-RELATED CACHE - Ensure fresh data
      try {
        console.log('🗑️ Force invalidating all assignment-related cache patterns...');
        await CacheService.invalidate('course-assignments', true);
        await CacheService.invalidate('all-assignments', true);
        await CacheService.invalidate('assignment-', true);
        console.log('✅ All assignment-related cache patterns invalidated');
      } catch (patternCacheError) {
        console.error('Pattern cache invalidation error (non-critical):', patternCacheError.message);
      }

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
   * @returns {Promise<Object} Assignment with optional submissions
   */  static async getAssignmentById(id, includeSubmissions = false) {
    try {
      // Try to get from cache first (only if not including submissions)
      const cacheKey = `assignment-${id}`;
      let cachedAssignment = null;
      
      if (!includeSubmissions) {
        try {
          cachedAssignment = await CacheService.get(cacheKey);          if (cachedAssignment) {
            console.log(`📦 Retrieved assignment ${id} from cache`);
            // Format cached assignment with WIB timezone
            return this.formatAssignmentResponse(cachedAssignment);
          }
        } catch (cacheError) {
          console.error(`Cache retrieval error (non-critical): ${cacheError.message}`);
        }
      }

      // Get fresh data from database
      const assignment = await prisma.assignment.findUnique({
        where: { id },
        include: {
          submissions: includeSubmissions
        }
      });

      if (!assignment) {
        throw new Error('Assignment not found');      }      // Format response with WIB timezone

      // Cache the assignment data (without isPastDue and submissions)
      if (!includeSubmissions) {
        try {
          const { submissions, isPastDue, dueDateWib, ...cacheData } = assignment;
          
          await CacheService.set(cacheKey, cacheData, 3600); // 1 hour cache
          console.log(`✅ Cached assignment ${id}`);
        } catch (cacheError) {
          console.error(`Cache setting error (non-critical): ${cacheError.message}`);
        }
      }

      // Format response with WIB timezone
      return this.formatAssignmentResponse(assignment);
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
      }      console.log(`✅ Course verification successful: ${courseId}`);

      // Try to get from cache first
      const cacheKey = `course-assignments-${courseId}`;
      let cachedAssignments = null;
      
      try {
        cachedAssignments = await CacheService.get(cacheKey);        if (cachedAssignments) {
          console.log(`📦 Retrieved ${cachedAssignments.length} assignments from cache for course ${courseId}`);
          
          // Format cached assignments with WIB timezone
          return cachedAssignments.map(assignment => this.formatAssignmentResponse(assignment));
        }
      } catch (cacheError) {
        console.error(`Cache retrieval error (non-critical): ${cacheError.message}`);
      }

      // Get fresh data from database if no cache
      const assignments = await prisma.assignment.findMany({
        where: { 
          courseId,
          status: 'ACTIVE'
        },
        orderBy: { dueDate: 'asc' }
      });
        console.log(`📋 Found ${assignments.length} assignments for course ${courseId}`);      
      // Format all assignments with WIB timezone
      const enhancedAssignments = assignments.map(assignment => this.formatAssignmentResponse(assignment));
      
      // Prepare cache data (without isPastDue for caching)
      const cacheData = enhancedAssignments.map(assignment => {
        const { isPastDue, ...assignmentForCache } = assignment;
        return assignmentForCache;
      });
      
      // Cache the data (without isPastDue)
      try {
        await CacheService.set(cacheKey, cacheData, 3600); // 1 hour cache
        console.log(`✅ Cached ${cacheData.length} assignments for course ${courseId}`);
      } catch (cacheError) {
        console.error(`Cache setting error (non-critical): ${cacheError.message}`);
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
        // Process dueDate - langsung gunakan input tanggal
        const processedDueDate = new Date(updateData.dueDate);
        if (isNaN(processedDueDate.getTime())) {
          throw new Error('Invalid due date format');
        }
        
        console.log('📅 Update - Original input dueDate:', updateData.dueDate);
        console.log('📅 Update - Processed dueDate:', processedDueDate);
        
        // Store as ISO string
        updateData.dueDate = processedDueDate.toISOString();
        console.log('📅 Update - Final ISO string:', updateData.dueDate);
      }
        const updatedAssignment = await prisma.assignment.update({
        where: { id },
        data: updateData
      });      // Invalidate multiple cache types
      try {
        await CacheService.invalidate(`course-assignments-${assignment.courseId}`, false);
        await CacheService.invalidate(`assignment-${id}`, false);
        await CacheService.invalidate('all-assignments', true); // ✅ Tambahkan ini
        console.log(`✅ Cache invalidated for assignment ${id} and course ${assignment.courseId}`);
      } catch (cacheError) {
        console.error('Cache invalidation error (non-critical):', cacheError.message);
      }
      
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
        try {
          await CacheService.invalidate(`course-assignments-${assignment.courseId}`, false);
          await CacheService.invalidate(`assignment-${id}`, false);
          await CacheService.invalidate('all-assignments', true); // ✅ Tambahkan ini
          console.log(`✅ Cache invalidated for soft-deleted assignment ${id} and course ${assignment.courseId}`);
        } catch (cacheError) {
          console.error('Cache invalidation error (non-critical):', cacheError.message);
        }
        
        return deletedAssignment;
      } else {
        // Hard delete if no submissions
        const deletedAssignment = await prisma.assignment.delete({
          where: { id }
        });
          // Invalidate cache
        try {
          await CacheService.invalidate(`course-assignments-${assignment.courseId}`, false);
          await CacheService.invalidate(`assignment-${id}`, false);
          await CacheService.invalidate('all-assignments', true); // ✅ Tambahkan ini
          console.log(`✅ Cache invalidated for hard-deleted assignment ${id} and course ${assignment.courseId}`);
        } catch (cacheError) {
          console.error('Cache invalidation error (non-critical):', cacheError.message);
        }
        
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
 * Get all assignments with optional filters
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} All assignments
 */
static async getAllAssignments(options = {}) {
  try {
    console.log('🔍 getAllAssignments called with options:', options);
    
    const { 
      status = null, 
      courseId = null,
      searchTerm = null,
      orderBy = { createdAt: 'desc' }
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
    
    console.log('🔍 Where clause:', JSON.stringify(where, null, 2));
    console.log('🔍 Order by:', JSON.stringify(orderBy, null, 2));
    
    // ✅ TAMBAHKAN: Test query langsung untuk assignment yang baru dibuat
    console.log('🧪 Testing direct query for latest assignments...');
    const latestAssignments = await prisma.assignment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log('🧪 Latest 5 assignments from database:', latestAssignments.map(a => ({
      id: a.id,
      title: a.title,
      status: a.status,
      createdAt: a.createdAt
    })));
    
    // Get all assignments without pagination
    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        _count: {
          select: { submissions: true }
        }
      },
      orderBy
    });
    
    console.log(`📋 Found ${assignments.length} total assignments`);
    console.log('📋 All assignment IDs:', assignments.map(a => a.id));
    console.log('📋 Latest 5 assignments:', assignments.slice(0, 5).map(a => ({
      id: a.id,
      title: a.title,
      status: a.status,
      createdAt: a.createdAt
    })));

    // ✅ CHECK: Apakah ada assignment dengan status ACTIVE yang baru dibuat?
    const activeAssignments = assignments.filter(a => a.status === 'ACTIVE');
    console.log(`📋 Active assignments: ${activeAssignments.length} out of ${assignments.length}`);    // Format all assignments with WIB timezone
    const enhancedAssignments = assignments.map(assignment => this.formatAssignmentResponse(assignment));
    
    console.log(`✅ Returning ${enhancedAssignments.length} enhanced assignments`);
    return enhancedAssignments;
  } catch (error) {
    console.error('❌ Error fetching all assignments:', error);
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
        // Add date format to each submission's assignment
      const finalSubmissions = enhancedSubmissions.map(submission => {
        if (submission.assignment && submission.assignment.dueDate) {
          const dueDate = new Date(submission.assignment.dueDate);
          return {
            ...submission,
            assignment: {
              ...submission.assignment,
              dueDateWib: dueDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta'
              })
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