import { asyncHandler } from '../middleware/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';
import { SessionService } from '../services/session.service.js';

/**
 * @desc    Create a new session
 * @route   POST /api/sessions
 * @access  Admin only
 */
export const createSession = asyncHandler(async (req, res) => {
  const { courseId, startAt, durationHrs, description } = req.body;
  
  // Validation
  if (!courseId || !startAt) {
    return res.status(400).json(
      ApiResponse.error('Course ID and start time are required')
    );
  }
  
  try {
    const session = await SessionService.createSession({
      courseId,
      startAt: new Date(startAt),
      durationHrs: durationHrs || 2,
      description
    });
    
    res.status(201).json(
      ApiResponse.success(session, 'Session created successfully')
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
 * @desc    Update a session
 * @route   PUT /api/sessions/:id
 * @access  Admin only
 */
export const updateSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startAt, durationHrs, description } = req.body;
  
  const updateData = {};
  if (startAt) updateData.startAt = new Date(startAt);
  if (durationHrs !== undefined) updateData.durationHrs = durationHrs;
  if (description !== undefined) updateData.description = description;
  
  try {
    const updatedSession = await SessionService.updateSession(id, updateData);
    
    res.status(200).json(
      ApiResponse.success(updatedSession, 'Session updated successfully')
    );
  } catch (error) {
    if (error.message === 'Session not found') {
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
  const { id } = req.params;
  
  try {
    await SessionService.deleteSession(id);
    
    res.status(200).json(
      ApiResponse.success(null, 'Session deleted successfully')
    );
  } catch (error) {
    if (error.message === 'Session not found') {
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
  const { courseId } = req.params;
  
  try {
    const sessions = await SessionService.getSessionsByCourse(courseId);
    
    res.status(200).json(
      ApiResponse.success(sessions)
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