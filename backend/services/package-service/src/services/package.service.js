import { PrismaClient } from '@prisma/client';
import { CourseService } from './course.service.js';

const prisma = new PrismaClient();

export const PackageService = {
  /**
   * Membuat package baru
   * @param {Object} data - Data package yang akan dibuat
   * @returns {Promise<Object>} Package yang telah dibuat
   */
  async createPackage(data) {
    return await prisma.package.create({
      data
    });
  },

  /**
   * Mendapatkan semua package dengan informasi course lengkap
   * @returns {Promise<Array>} Daftar semua package dengan detail course
   */
  async getAllPackages() {
    // Get all packages with their courses
    const packages = await prisma.package.findMany({
      include: {
        courses: true
      }
    });
    
    // Extract all course IDs
    const allCourseIds = packages.flatMap(pkg => 
      pkg.courses.map(course => course.courseId)
    );
    
    // Fetch course details for all course IDs
    const coursesMap = await CourseService.getCoursesByIds(allCourseIds);
    
    // Enhance each package with course details
    return packages.map(pkg => ({
      ...pkg,
      courses: pkg.courses.map(course => ({
        ...course,
        title: coursesMap[course.courseId]?.title || 'Unknown Course',
        description: coursesMap[course.courseId]?.description || null,
        level: coursesMap[course.courseId]?.level || null
      }))
    }));
  },

  /**
   * Mendapatkan package berdasarkan ID dengan informasi course lengkap
   * @param {string} id - ID package
   * @returns {Promise<Object|null>} Package yang ditemukan atau null
   */
  async getPackageById(id) {
    // Get package with courses
    const package_ = await prisma.package.findUnique({
      where: { id },
      include: {
        courses: true
      }
    });
    
    if (!package_) return null;
    
    // Extract course IDs
    const courseIds = package_.courses.map(course => course.courseId);
    
    // Fetch course details
    const coursesMap = await CourseService.getCoursesByIds(courseIds);
    
    // Enhance package with course details
    return {
      ...package_,
      courses: package_.courses.map(course => ({
        ...course,
        title: coursesMap[course.courseId]?.title || 'Unknown Course',
        description: coursesMap[course.courseId]?.description || null,
        level: coursesMap[course.courseId]?.level || null
      }))
    };
  },

  /**
   * Memperbarui package
   * @param {string} id - ID package
   * @param {Object} data - Data yang akan diperbarui
   * @returns {Promise<Object>} Package yang telah diperbarui
   */
  async updatePackage(id, data) {
    return await prisma.package.update({
      where: { id },
      data
    });
  },

  /**
   * Menghapus package
   * @param {string} id - ID package
   * @returns {Promise<Object>} Package yang telah dihapus
   */
  async deletePackage(id) {
    // First delete all associated courses in PackageCourse table
    await prisma.packageCourse.deleteMany({
      where: { packageId: id }
    });
    
    // Then delete the package itself
    return await prisma.package.delete({
      where: { id }
    });
  }
};