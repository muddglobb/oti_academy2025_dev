import { AssignmentService } from '../services/assignment.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { Roles } from '../utils/rbac/roles.js';
import { DateHelper } from '../utils/date-helper.js';
import { isValidFileUrl, getUrlValidationError } from '../utils/url-validator.js';

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 * @access  Admin only
 */
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, courseId, dueDate, points, resourceUrl } = req.body;
  
  // Validate required fields
  if (!title || !description || !courseId) {
    return res.status(400).json(
      ApiResponse.error('Title, description, and course ID are required')
    );
  }
    try {
    console.log('📅 Controller - Creating assignment with dueDate:', dueDate);
    
    const assignment = await AssignmentService.createAssignment({
      title,
      description,
      courseId,
      dueDate: dueDate || undefined, // Pass as is, let the service handle conversion
      points,
      resourceUrl
    });
    
    res.status(201).json(
      ApiResponse.success(assignment, 'Assignment created successfully')
    );
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json(
        ApiResponse.error('Course not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Get all assignments (admin view)
 * @route   GET /api/assignments/admin
 * @access  Admin only
 */
export const getAllAssignments = asyncHandler(async (req, res) => {
  // Pagination options
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Filter options
  const { status, courseId, search } = req.query;
  
  const result = await AssignmentService.getAllAssignments({
    skip,
    limit,
    status,
    courseId,
    searchTerm: search
  });
  
  res.status(200).json(
    ApiResponse.success(result)
  );
});

/**
 * @desc    Get assignments by course
 * @route   GET /api/assignments/course/:courseId
 * @access  Authenticated
 */
export const getAssignmentsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  console.log(`🔍 Fetching assignments for course: ${courseId}`);
  
  try {
    const assignments = await AssignmentService.getAssignmentsByCourse(courseId);
    
    console.log(`✅ Found ${assignments ? assignments.length : 0} assignments for course ${courseId}`);
    
    // Memastikan selalu mengembalikan array (kosong jika tidak ada data)
    const result = assignments || [];
    
    res.status(200).json(
      ApiResponse.success(result)
    );
  } catch (error) {
    console.error(`❌ Error fetching assignments for course ${courseId}:`, error);
    
    if (error.message === 'Course not found') {
      return res.status(404).json(
        ApiResponse.error('Course not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Get assignment by ID
 * @route   GET /api/assignments/:id
 * @access  Authenticated
 */
export const getAssignmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    // Determine if submissions should be included based on user role
    const includeSubmissions = req.user.role === Roles.ADMIN;
    
    const assignment = await AssignmentService.getAssignmentById(id, includeSubmissions);
    
    res.status(200).json(
      ApiResponse.success(assignment)
    );
  } catch (error) {
    if (error.message === 'Assignment not found') {
      return res.status(404).json(
        ApiResponse.error('Assignment not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Update assignment
 * @route   PUT /api/assignments/:id
 * @access  Admin only
 */
export const updateAssignment = asyncHandler(async (req, res) => {  
  const { id } = req.params;
  const { title, description, dueDate, points, status, resourceUrl } = req.body;
  
  const updateData = {};
  
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (dueDate !== undefined) {
    // Pass the dueDate as a string or Date object, let the service handle the conversion
    updateData.dueDate = dueDate;
    console.log('📅 Controller - dueDate received:', dueDate);
  }
  if (points !== undefined) updateData.points = points;
  if (status !== undefined) updateData.status = status;
  if (resourceUrl !== undefined) updateData.resourceUrl = resourceUrl;
  try {
    const assignment = await AssignmentService.updateAssignment(id, updateData);
    
    res.status(200).json(
      ApiResponse.success(assignment, 'Assignment updated successfully')
    );
  } catch (error) {
    if (error.message === 'Assignment not found') {
      return res.status(404).json(
        ApiResponse.error('Assignment not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Delete assignment
 * @route   DELETE /api/assignments/:id
 * @access  Admin only
 */
export const deleteAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    await AssignmentService.deleteAssignment(id);
    
    res.status(200).json(
      ApiResponse.success(null, 'Assignment deleted successfully')
    );
  } catch (error) {
    if (error.message === 'Assignment not found') {
      return res.status(404).json(
        ApiResponse.error('Assignment not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Submit assignment
 * @route   POST /api/submissions/:assignmentId
 * @access  Students only
 */
export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { fileUrl } = req.body;
  const userId = req.user.id;
  
  if (!fileUrl) {
    return res.status(400).json(
      ApiResponse.error('File URL is required')
    );
  }
  
  // Validate file URL
  if (!isValidFileUrl(fileUrl)) {
    return res.status(400).json(
      ApiResponse.error(getUrlValidationError(fileUrl))
    );
  }
  
  try {
    const submission = await AssignmentService.submitAssignment({
      assignmentId,
      userId,
      fileUrl
    });
    
    res.status(201).json(
      ApiResponse.success(submission, 'Assignment submitted successfully')
    );
  } catch (error) {
    if (error.message === 'Assignment not found or inactive') {
      return res.status(404).json(
        ApiResponse.error('Assignment not found or inactive')
      );
    } else if (error.message === 'Assignment due date has passed') {
      return res.status(400).json(
        ApiResponse.error('Assignment due date has passed')
      );
    } else if (error.message === 'You are not enrolled in this course') {
      return res.status(403).json(
        ApiResponse.error('You are not enrolled in this course')
      );
    }
    throw error;
  }
});

/**
 * @desc    Get all submissions for a course
 * @route   GET /api/submissions/course/:courseId
 * @access  Admin only
 */
export const getSubmissionsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  // Pagination options
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Filter options
  const { status, userId } = req.query;
  
  try {
    const result = await AssignmentService.getSubmissionsByCourse(courseId, {
      skip,
      limit,
      status,
      userId
    });
    
    res.status(200).json(
      ApiResponse.success(result)
    );
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json(
        ApiResponse.error('Course not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Get submissions for a student
 * @route   GET /api/submissions/user/:userId
 * @access  Self or admin
 */
export const getStudentSubmissions = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Check if user is accessing their own submissions or is an admin
  if (userId !== req.user.id && req.user.role !== Roles.ADMIN) {
    return res.status(403).json(
      ApiResponse.error('You can only view your own submissions')
    );
  }
  
  const submissions = await AssignmentService.getStudentSubmissions(userId);
  
  res.status(200).json(
    ApiResponse.success(submissions)
  );
});

/**
 * @desc    Get all submissions (admin view)
 * @route   GET /api/submissions
 * @access  Admin only
 */
export const getAllSubmissions = asyncHandler(async (req, res) => {
  // Pagination options
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Filter options
  const { status, assignmentId, userId } = req.query;
  
  const result = await AssignmentService.getAllSubmissions({
    skip,
    limit,
    status,
    assignmentId,
    userId
  });
  
  res.status(200).json(
    ApiResponse.success(result)
  );
});

// Grading functionality removed as per requirements

/**
 * @desc    Verify service access token for inter-service communication
 * @route   GET /api/assignments/service/verify
 * @access  Service-to-service
 */
export const verifyServiceAccess = asyncHandler(async (req, res) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      ApiResponse.error('Service authentication required')
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Check if it's a valid service token
    if (decoded.service && decoded.role === 'SERVICE') {
      return res.status(200).json(
        ApiResponse.success({ 
          authenticated: true,
          service: decoded.service
        })
      );
    } else {
      return res.status(403).json(
        ApiResponse.error('Invalid service credentials')
      );
    }
  } catch (error) {
    return res.status(401).json(
      ApiResponse.error('Invalid or expired service token')
    );
  }
});

/**
 * @desc    Update submission file URL
 * @route   PATCH /api/submissions/:submissionId
 * @access  Submission owner only
 */
export const updateSubmissionFileUrl = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { fileUrl } = req.body;
  const userId = req.user.id;
  
  if (!fileUrl) {
    return res.status(400).json(
      ApiResponse.error('File URL is required')
    );
  }
  
  // Validate file URL
  if (!isValidFileUrl(fileUrl)) {
    return res.status(400).json(
      ApiResponse.error(getUrlValidationError(fileUrl))
    );
  }
  
  try {
    const updatedSubmission = await AssignmentService.updateSubmissionFileUrl(
      submissionId,
      userId,
      fileUrl
    );
    
    res.status(200).json(
      ApiResponse.success(updatedSubmission, 'Submission file updated successfully')
    );
  } catch (error) {
    if (error.message === 'Submission not found') {
      return res.status(404).json(
        ApiResponse.error('Submission not found')
      );
    } else if (error.message === 'You can only update your own submissions') {
      return res.status(403).json(
        ApiResponse.error('You can only update your own submissions')
      );
    } else if (error.message === 'Cannot update submission for inactive assignment') {
      return res.status(400).json(
        ApiResponse.error('Cannot update submission for inactive assignment')
      );
    } else if (error.message === 'Assignment due date has passed') {
      return res.status(400).json(
        ApiResponse.error('Assignment due date has passed')
      );
    }
    throw error;
  }
});

/**
 * @desc    Get logged-in user's submissions
 * @route   GET /api/submissions/me
 * @access  Authenticated
 */
export const getMySubmissions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  try {
    console.log(`🔍 Fetching submissions for user: ${userId}`);
    
    const submissions = await AssignmentService.getStudentSubmissions(userId);
    
    console.log(`✅ Found ${submissions ? submissions.length : 0} submissions for user ${userId}`);
    
    // Enhance submission data with assignment information
    const enhancedSubmissions = submissions.map(submission => {
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
    
    res.status(200).json(
      ApiResponse.success(enhancedSubmissions)
    );
  } catch (error) {
    console.error(`❌ Error fetching user submissions for ${userId}:`, error);
    throw error;
  }
});