import { asyncHandler } from '../middleware/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';
import { SessionService } from '../services/session.service.js';
import { sanitizeAndValidateId, getInvalidIdMessage } from '../utils/validators.js';
import { SessionNotFoundError, CourseNotFoundError } from '../utils/errors.js';
import { validateSessionCreate, validateSessionUpdate } from '../utils/schema-validator.js';

/**
 * @desc    Create a new session
 * @route   POST /api/sessions
 * @access  Admin only
 */
export const createSession = asyncHandler(async (req, res) => {
  // Use schema-based validation for complete data isolation
  const validation = validateSessionCreate(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json(
      ApiResponse.error(`Validation failed: ${validation.errors.join(', ')}`)
    );
  }

  // Extract the completely sanitized and validated data
  const secureSessionData = validation.sanitizedData;

  try {
    const session = await SessionService.createSession(secureSessionData);
    
    res.status(201).json(
      ApiResponse.success(session, 'Session created successfully')
    );
  } catch (error) {
    // Safe error handling - check error type without using error.message
    if (error instanceof CourseNotFoundError) {
      return res.status(404).json(
        ApiResponse.error('Course not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Update a session
 * @route   PUT /api/sessions/:id
 * @access  Admin only
 */
export const updateSession = asyncHandler(async (req, res) => {
  // Validate and sanitize ID from params first
  const id = sanitizeAndValidateId(req.params.id);
  if (!id) {
    return res.status(400).json(
      ApiResponse.error(getInvalidIdMessage('session'))
    );
  }

  // Use schema-based validation for complete data isolation
  const validation = validateSessionUpdate(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json(
      ApiResponse.error(`Validation failed: ${validation.errors.join(', ')}`)
    );
  }

  // Extract the completely sanitized and validated data
  const secureUpdateData = validation.sanitizedData;

  try {
    const updatedSession = await SessionService.updateSession(id, secureUpdateData);
    
    res.status(200).json(
      ApiResponse.success(updatedSession, 'Session updated successfully')
    );
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      return res.status(404).json(
        ApiResponse.error('Session not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Delete a session
 * @route   DELETE /api/sessions/:id
 * @access  Admin only
 */
export const deleteSession = asyncHandler(async (req, res) => {
  const rawId = req.params.id;
  
  // Validate and sanitize ID
  const id = sanitizeAndValidateId(rawId);
  if (!id) {
    return res.status(400).json(
      ApiResponse.error(getInvalidIdMessage('session'))
    );
  }
  try {
    await SessionService.deleteSession(id);
    
    res.status(200).json(
      ApiResponse.success(null, 'Session deleted successfully')
    );
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      return res.status(404).json(
        ApiResponse.error('Session not found')
      );
    }
    throw error;
  }
});

/**
 * @desc    Get all sessions for a course
 * @route   GET /api/courses/:courseId/sessions
 * @access  All authenticated users
 */
export const getSessionsByCourse = asyncHandler(async (req, res) => {
  const rawCourseId = req.params.courseId;
  
  // Validate and sanitize courseId
  const courseId = sanitizeAndValidateId(rawCourseId);
  if (!courseId) {
    return res.status(400).json(
      ApiResponse.error(getInvalidIdMessage('course'))
    );
  }
  try {
    const sessions = await SessionService.getSessionsByCourse(courseId);
    
    res.status(200).json(
      ApiResponse.success(sessions)
    );
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      return res.status(404).json(
        ApiResponse.error('Course not found')
      );
    }
    throw error;
  }
});