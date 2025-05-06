import { Router } from 'express';
import { authenticate, permit, Roles, ApiResponse } from '../config/auth.js';
import { PackageService } from '../services/package.service.js';
import { PackageCourseService } from '../services/packageCourse.service.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

const router = Router({ mergeParams: true });

/**
 * @route   GET /packages/:packageId/courses
 * @desc    Get all courses in a package
 * @access  All authenticated users
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  
  // Validasi package
  const package_ = await PackageService.getPackageById(packageId);
  if (!package_) {
    return res.status(404).json(
      ApiResponse.error('Package tidak ditemukan')
    );
  }
  
  const packageCourses = await PackageCourseService.listCoursesInPackage(packageId);
  
  // Tambahkan data dummy untuk course
  const coursesWithDummyData = PackageCourseService.addDummyCourseData(packageCourses);
  
  res.status(200).json(
    ApiResponse.success(coursesWithDummyData)
  );
}));

/**
 * @route   POST /packages/:packageId/courses
 * @desc    Add course to a package
 * @access  Admin only
 */
router.post('/', authenticate, permit(Roles.ADMIN), asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const { courseId } = req.body;
  
  // Validasi input
  if (!courseId) {
    return res.status(400).json(
      ApiResponse.error('CourseID wajib diisi')
    );
  }
  
  // Validasi package
  const package_ = await PackageService.getPackageById(packageId);
  if (!package_) {
    return res.status(404).json(
      ApiResponse.error('Package tidak ditemukan')
    );
  }
  
  try {
    const packageCourse = await PackageCourseService.addCourseToPackage(packageId, courseId);
    
    res.status(201).json(
      ApiResponse.success(packageCourse, 'Course berhasil ditambahkan ke package')
    );
  } catch (error) {
    // Untuk menangani kasus di mana relasi sudah ada
    if (error.code === 'P2002') {
      return res.status(400).json(
        ApiResponse.error('Course sudah ada dalam package')
      );
    }
    throw error;
  }
}));

/**
 * @route   DELETE /packages/:packageId/courses/:courseId
 * @desc    Remove course from a package
 * @access  Admin only
 */
router.delete('/:courseId', authenticate, permit(Roles.ADMIN), asyncHandler(async (req, res) => {
  const { packageId, courseId } = req.params;
  
  try {
    await PackageCourseService.removeCourseFromPackage(packageId, courseId);
    
    res.status(200).json(
      ApiResponse.success(null, 'Course berhasil dihapus dari package')
    );
  } catch (error) {
    // Handle kasus di mana relasi tidak ditemukan
    if (error.code === 'P2025') {
      return res.status(404).json(
        ApiResponse.error('Relasi package course tidak ditemukan')
      );
    }
    throw error;
  }
}));

export default router;