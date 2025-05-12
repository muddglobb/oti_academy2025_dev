import { AssignmentService } from '../services/assignment.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { Roles } from '../utils/rbac/roles.js';

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 * @access  Admin only
 */
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, courseId, dueDate, points } = req.body;
  
  // Validate required fields
  if (!title || !description || !courseId) {
    return res.status(400).json(
      ApiResponse.error('Title, description, and course ID are required')
    );
  }
  
  try {
    const assignment = await AssignmentService.createAssignment({
      title,
      description,
      courseId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      points
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
  
  const assignments = await AssignmentService.getAssignmentById(null, false, { skip, limit });
  
  res.status(200).json(
    ApiResponse.success(assignments)
  );
});

/**
 * @desc    Get assignments by course
 * @route   GET /api/assignments/course/:courseId
 * @access  Authenticated
 */
export const getAssignmentsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  try {
    const assignments = await AssignmentService.getAssignmentsByCourse(courseId);
    
    res.status(200).json(
      ApiResponse.success(assignments)
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
  const { title, description, dueDate, points, status } = req.body;
  
  const updateData = {};
  
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
  if (points !== undefined) updateData.points = points;
  if (status !== undefined) updateData.status = status;
  
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
 * @route   POST /api/assignments/:id/submit
 * @access  Students only
 */
export const submitAssignment = asyncHandler(async (req, res) => {
  const { id: assignmentId } = req.params;
  const { content, fileUrl } = req.body;
  const userId = req.user.id;
  
  if (!content && !fileUrl) {
    return res.status(400).json(
      ApiResponse.error('Content or file URL is required')
    );
  }
  
  try {
    const submission = await AssignmentService.submitAssignment({
      assignmentId,
      userId,
      content,
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
 * @desc    Get all submissions for an assignment
 * @route   GET /api/assignments/:id/submissions
 * @access  Admin only
 */
export const getSubmissionsByAssignment = asyncHandler(async (req, res) => {
  const { id: assignmentId } = req.params;
  
  try {
    const submissions = await AssignmentService.getSubmissionsByAssignment(assignmentId);
    
    res.status(200).json(
      ApiResponse.success(submissions)
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
 * @desc    Get submissions for a student
 * @route   GET /api/assignments/submissions/user/:userId
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
 * @desc    Grade a submission
 * @route   POST /api/assignments/submissions/:submissionId/grade
 * @access  Admin only
 */
export const gradeSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { score, feedback } = req.body;
  
  if (score === undefined) {
    return res.status(400).json(
      ApiResponse.error('Score is required')
    );
  }
  
  try {
    const submission = await AssignmentService.gradeSubmission(submissionId, {
      score,
      feedback
    });
    
    res.status(200).json(
      ApiResponse.success(submission, 'Submission graded successfully')
    );
  } catch (error) {
    if (error.message === 'Submission not found') {
      return res.status(404).json(
        ApiResponse.error('Submission not found')
      );
    } else if (error.message === 'Score must be between 0 and 100') {
      return res.status(400).json(
        ApiResponse.error('Score must be between 0 and 100')
      );
    }
    throw error;
  }
});

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