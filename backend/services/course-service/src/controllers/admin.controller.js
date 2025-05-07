import { asyncHandler } from '../middleware/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';
import { CourseService } from '../services/course.service.js';
import config from '../config/index.js';

/**
 * @desc    Create a new course
 * @route   POST /api/admin/courses
 * @access  Admin only
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, level, quota } = req.body;
  
  // Validation
  if (!title || !description) {
    return res.status(400).json(
      ApiResponse.error('Please provide course title and description')
    );
  }
  
  // Create course
  const course = await CourseService.createCourse({
    title,
    description,
    level: level || 'BEGINNER',
    quota: quota || config.DEFAULT_COURSE_QUOTA
  });
  
  res.status(201).json(
    ApiResponse.success(course, 'Course created successfully')
  );
});

/**
 * @desc    Update a course
 * @route   PUT /api/admin/courses/:id
 * @access  Admin only
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, level, quota } = req.body;
  
  try {
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (level !== undefined) updateData.level = level;
    if (quota !== undefined) updateData.quota = quota;
    
    const updatedCourse = await CourseService.updateCourse(id, updateData);
    
    res.status(200).json(
      ApiResponse.success(updatedCourse, 'Course updated successfully')
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