import { PackageCourseService } from '../services/packageCourse.service.js';
import { PackageService } from '../services/package.service.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';

// @desc    Menambahkan course ke package
// @route   POST /package-courses
// @access  Public
export const addCourseToPackage = asyncHandler(async (req, res) => {
  const { packageId, courseId } = req.body;
  
  // Validasi input
  if (!packageId || !courseId) {
    return res.status(400).json(
      ApiResponse.error('PackageID dan CourseID wajib diisi')
    );
  }
  
  // Validasi package
  const package_ = await PackageService.getPackageById(packageId);
  if (!package_) {
    return res.status(404).json(
      ApiResponse.error('Package tidak ditemukan')
    );
  }
  
  // Catatan: Di lingkungan produksi, kita perlu memvalidasi keberadaan course di course-service
  // Tapi untuk sekarang, kita hanya menerima courseId sebagai string yang valid
  
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
});

// @desc    Menghapus course dari package
// @route   DELETE /package-courses
// @access  Public
export const removeCourseFromPackage = asyncHandler(async (req, res) => {
  const { packageId, courseId } = req.body;
  
  // Validasi input
  if (!packageId || !courseId) {
    return res.status(400).json(
      ApiResponse.error('PackageID dan CourseID wajib diisi')
    );
  }
  
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
});

// @desc    Mendapatkan semua course dalam package
// @route   GET /package-courses/:packageId
// @access  Public
export const listCoursesInPackage = asyncHandler(async (req, res) => {
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
  
  // Format respons berdasarkan tipe package
  const formattedResponse = await PackageCourseService.formatCourseResponse(coursesWithDummyData, packageId);
  
  res.status(200).json(
    ApiResponse.success(formattedResponse)
  );
});