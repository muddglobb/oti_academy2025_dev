import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PackageCourseService = {
  /**
   * Menambahkan course ke package
   * @param {string} packageId - ID package
   * @param {string} courseId - ID course
   * @returns {Promise<Object>} Relasi PackageCourse yang telah dibuat
   */
  async addCourseToPackage(packageId, courseId) {
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

    // Mengembalikan daftar courseId saja
    return packageCourses;
  },

  /**
   * Menambahkan dummy course data untuk respons API
   * @param {Array} packageCourses - Daftar PackageCourse
   * @returns {Array} Daftar course dengan data dummy
   */
  addDummyCourseData(packageCourses) {
    const dummyCourseMap = {
      'course-uuid-001': 'Intro to Web Development',
      'course-uuid-002': 'Intermediate JavaScript',
      'course-uuid-003': 'React Fundamentals',
      'course-uuid-004': 'NodeJS Basics',
      'course-uuid-005': 'Full Stack Development',
    };

    return packageCourses.map(pc => ({
      courseId: pc.courseId,
      title: dummyCourseMap[pc.courseId] || `Course ${pc.courseId}`,
      packageId: pc.packageId
    }));
  }
};