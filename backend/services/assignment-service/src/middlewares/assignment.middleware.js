import { ApiResponse } from '../utils/api-response.js';
import { AssignmentService } from '../services/assignment.service.js';
import { Roles, isStudent } from '../utils/rbac/roles.js';
import { z } from 'zod';

/**
 * Validate assignment creation data
 */
export const validateAssignmentData = (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(5, 'Title must be at least 5 characters'),
      description: z.string().min(20, 'Description must be at least 20 characters'),
      courseId: z.string().uuid('Invalid course ID format'),
      dueDate: z.string().datetime().optional(),
      points: z.number().int().positive().max(100).optional()
    });

    schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors?.map(e => ({
      field: e.path.join('.'),
      message: e.message
    })) || [];

    return res.status(400).json(
      ApiResponse.error('Validation failed', errors)
    );
  }
};

/**
 * Validate submission creation data
 */
export const validateSubmissionData = (req, res, next) => {
  try {
    const schema = z.object({
      content: z.string().optional(),
      fileUrl: z.string().url('Invalid file URL').optional()
    }).refine(data => data.content || data.fileUrl, {
      message: 'Either content or fileUrl must be provided'
    });

    schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors?.map(e => ({
      field: e.path.join('.'),
      message: e.message
    })) || [];

    return res.status(400).json(
      ApiResponse.error('Validation failed', errors)
    );
  }
};

/**
 * Validate grading data
 */
export const validateGradingData = (req, res, next) => {
  try {
    const schema = z.object({
      score: z.number().int().min(0).max(100),
      feedback: z.string().optional()
    });

    schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors?.map(e => ({
      field: e.path.join('.'),
      message: e.message
    })) || [];

    return res.status(400).json(
      ApiResponse.error('Validation failed', errors)
    );
  }
};

/**
 * Verify assignment exists and belongs to course
 */
export const verifyAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    
    if (!assignmentId) {
      return res.status(400).json(
        ApiResponse.error('Assignment ID is required')
      );
    }

    const assignment = await AssignmentService.getAssignmentById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json(
        ApiResponse.error('Assignment not found')
      );
    }

    // Add assignment to request object for future middleware/controllers
    req.assignment = assignment;
    next();
  } catch (error) {
    console.error('Error verifying assignment:', error);
    return res.status(500).json(
      ApiResponse.error('Error verifying assignment')
    );
  }
};

/**
 * Verify user is enrolled in the assignment's course
 */
export const verifyEnrollment = async (req, res, next) => {
  try {
    // Skip for admin users
    if (req.user.role === Roles.ADMIN) {
      return next();
    }

    const assignmentId = req.params.id;
    const userId = req.user.id;
    
    // Get the assignment to find the course
    const assignment = req.assignment || await AssignmentService.getAssignmentById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json(
        ApiResponse.error('Assignment not found')
      );
    }

    // Check if user is enrolled in the course
    const isEnrolled = await AssignmentService.verifyEnrollment(userId, assignment.courseId);
    
    if (!isEnrolled) {
      return res.status(403).json(
        ApiResponse.error('You are not enrolled in this course')
      );
    }

    next();
  } catch (error) {
    console.error('Error verifying enrollment:', error);
    return res.status(500).json(
      ApiResponse.error('Error verifying course enrollment')
    );
  }
};

/**
 * Check if assignment due date has passed
 */
export const checkDueDate = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    
    // Skip for admin users
    if (req.user.role === Roles.ADMIN) {
      return next();
    }
    
    // Get the assignment
    const assignment = req.assignment || await AssignmentService.getAssignmentById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json(
        ApiResponse.error('Assignment not found')
      );
    }

    // Check if due date has passed
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json(
        ApiResponse.error('Assignment due date has passed')
      );
    }

    next();
  } catch (error) {
    console.error('Error checking due date:', error);
    return res.status(500).json(
      ApiResponse.error('Error checking assignment due date')
    );
  }
};

/**
 * Check if user owns the submission or is admin
 */
export const verifySubmissionOwnership = async (req, res, next) => {
  try {
    const submissionId = req.params.submissionId;
    const userId = req.user.id;
    
    // Skip for admin users
    if (req.user.role === Roles.ADMIN) {
      return next();
    }
    
    // Get the submission
    const submission = await AssignmentService.getSubmissionById(submissionId);
    
    if (!submission) {
      return res.status(404).json(
        ApiResponse.error('Submission not found')
      );
    }

    // Check if user owns the submission
    if (submission.userId !== userId) {
      return res.status(403).json(
        ApiResponse.error('You can only access your own submissions')
      );
    }

    // Add submission to request object
    req.submission = submission;
    next();
  } catch (error) {
    console.error('Error verifying submission ownership:', error);
    return res.status(500).json(
      ApiResponse.error('Error verifying submission ownership')
    );
  }
};

/**
 * Verify if service is authorized to access resources
 */
export const verifyServiceAccess = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      ApiResponse.error('Service authentication required')
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    // Get JWT_SECRET from config
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json(
        ApiResponse.error('Server configuration error')
      );
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if it's a valid service token
    if (decoded.service && decoded.role === 'SERVICE') {
      // Add service info to request
      req.service = {
        name: decoded.service
      };
      next();
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
};

/**
 * Check if assignment is active
 */
export const checkAssignmentActive = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    
    // Get the assignment
    const assignment = req.assignment || await AssignmentService.getAssignmentById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json(
        ApiResponse.error('Assignment not found')
      );
    }

    // Check if assignment is active
    if (assignment.status !== 'ACTIVE') {
      return res.status(400).json(
        ApiResponse.error('This assignment is no longer active')
      );
    }

    next();
  } catch (error) {
    console.error('Error checking assignment status:', error);
    return res.status(500).json(
      ApiResponse.error('Error checking assignment status')
    );
  }
};