import { PrismaClient } from '@prisma/client';
import { CourseService } from './course.service.js';

const prisma = new PrismaClient();

export const PackageCourseService = {
  /**
   * Validasi apakah course dapat ditambahkan ke package berdasarkan tipe
   * @param {string} packageId - ID package
   * @param {string} courseId - ID course yang akan ditambahkan
   * @returns {Promise<Object>} Hasil validasi dengan status dan pesan
   */
  async validateCourseAddition(packageId, courseId) {
    // Dapatkan package beserta tipenya
    const package_ = await prisma.package.findUnique({
      where: { id: packageId }
    });
    
    if (!package_) {
      return { valid: false, message: 'Package tidak ditemukan' };
    }
    
    // Validasi course exists in course-service
    const course = await CourseService.getCourseById(courseId);
    if (!course) {
      return { valid: false, message: 'Course tidak ditemukan di course-service' };
    }
    
    // Untuk package tipe ENTRY dan INTERMEDIATE, cek level
    if (package_.type === 'ENTRY' || package_.type === 'INTERMEDIATE') {
      // Cek kesesuaian level course dengan tipe package
      if ((package_.type === 'ENTRY' && course.level !== 'ENTRY') ||
          (package_.type === 'INTERMEDIATE' && course.level !== 'INTERMEDIATE')) {
        return { valid: false, message: `Course level ${course.level} tidak sesuai dengan package tipe ${package_.type}` };
      }
      return { valid: true };
    }
    
    // Untuk package tipe BUNDLE, pengecekan khusus
    if (package_.type === 'BUNDLE') {
      // Pertama, cek apakah course sudah ada dalam package
      const existingCourse = await prisma.packageCourse.findUnique({
        where: {
          packageId_courseId: {
            packageId,
            courseId
          }
        }
      });
      
      if (existingCourse) {
        return { valid: false, message: 'Course ini sudah ada dalam package' };
      }
      
      // Dapatkan semua course dalam package
      const packageCourses = await prisma.packageCourse.findMany({
        where: { packageId }
      });
      
      // Jumlah course ganjil menandakan bundle tidak lengkap
      if (packageCourses.length % 2 === 0) {
        // Jika jumlah course genap, berarti semua bundle sudah lengkap (2 course per bundle)
        // Izinkan penambahan course baru untuk memulai bundle baru
        return { valid: true };
      } else {
        // Jika jumlah course ganjil, berarti ada bundle yang belum lengkap
        // Izinkan penambahan untuk melengkapi bundle yang belum lengkap
        return { valid: true };
      }
    }
    
    return { valid: true };
  },

  /**
   * Menambahkan pasangan course ke package tipe BUNDLE
   * @param {string} packageId - ID package
   * @param {Array} courseIds - Array berisi 2 course ID
   * @returns {Promise<Array>} Array hasil penambahan course
   */
  async addCoursePairToPackage(packageId, courseIds) {
    // Validasi course tidak ada yang duplicated
    for (const courseId of courseIds) {
      const existingCourse = await prisma.packageCourse.findUnique({
        where: {
          packageId_courseId: {
            packageId,
            courseId
          }
        }
      });
      
      if (existingCourse) {
        throw new Error(`Course dengan ID ${courseId} sudah ada dalam package`);
      }
      
      // Validasi course exists in course-service
      const course = await CourseService.getCourseById(courseId);
      if (!course) {
        throw new Error(`Course dengan ID ${courseId} tidak ditemukan di course-service`);
      }
    }
    
    // Tambahkan kedua course secara berurutan
    const results = [];
    for (const courseId of courseIds) {
      const result = await prisma.packageCourse.create({
        data: {
          packageId,
          courseId
        }
      });
      results.push(result);
    }
    
    return results;
  },

  /**
   * Menambahkan course ke package
   * @param {string} packageId - ID package
   * @param {string} courseId - ID course
   * @returns {Promise<Object>} Relasi PackageCourse yang telah dibuat
   */
  async addCourseToPackage(packageId, courseId) {
    // Validasi course exists in course-service
    const course = await CourseService.getCourseById(courseId);
    if (!course) {
      throw new Error(`Course dengan ID ${courseId} tidak ditemukan di course-service`);
    }
    
    return await prisma.packageCourse.create({
      data: {
        packageId,
        courseId
      }
    });
  },

  /**
   * Menghapus course dari package
   * @param {string} packageId - ID package
   * @param {string} courseId - ID course
   * @returns {Promise<Object>} Relasi PackageCourse yang telah dihapus
   */
  async removeCourseFromPackage(packageId, courseId) {
    return await prisma.packageCourse.delete({
      where: {
        packageId_courseId: {
          packageId,
          courseId
        }
      }
    });
  },

  /**
   * Mendapatkan semua course dalam package
   * @param {string} packageId - ID package
   * @returns {Promise<Array>} Daftar course dalam package
   */
  async listCoursesInPackage(packageId) {
    const packageCourses = await prisma.packageCourse.findMany({
      where: {
        packageId
      }
    });

    // Get actual course data from course-service
    const courseIds = packageCourses.map(pc => pc.courseId);
    
    if (courseIds.length === 0) {
      return [];
    }
    
    const coursesMap = await CourseService.getCoursesByIds(courseIds);
    
    // Map package course relations with actual course data
    return packageCourses.map(pc => {
      const courseData = coursesMap[pc.courseId]; // Access map directly by courseId key
      return {
        courseId: pc.courseId,
        title: courseData ? courseData.title : `Unknown Course (${pc.courseId})`,
        description: courseData ? courseData.description : null,
        level: courseData ? courseData.level : null,
        packageId: pc.packageId
      };
    });
  },

  /**
   * Format respons course berdasarkan tipe package
   * @param {Array} courses - Daftar course dengan data lengkap
   * @param {string} packageId - ID package
   * @returns {Object} Respons yang sudah diformat sesuai tipe package
   */
  async formatCourseResponse(courses, packageId) {
    // Dapatkan informasi package terlebih dahulu
    const package_ = await prisma.package.findUnique({
      where: { id: packageId }
    });
    
    if (!package_) {
      return { courses };
    }
    
    // Jika bukan BUNDLE, kembalikan format biasa
    if (package_.type !== 'BUNDLE') {
      return { courses };
    }
    
    // Untuk package tipe BUNDLE, kelompokkan menjadi pasangan
    const bundlePairs = [];
    
    // Kelompokkan course menjadi pasangan
    for (let i = 0; i < courses.length; i += 2) {
      // Jika masih ada pasangan lengkap (2 course)
      if (i + 1 < courses.length) {
        bundlePairs.push({
          courses: [courses[i], courses[i + 1]]
        });
      } 
      // Jika tersisa 1 course (tidak berpasangan)
      else {
        bundlePairs.push({
          courses: [courses[i]]
        });
      }
    }
    
    return { bundlePairs };
  }
};