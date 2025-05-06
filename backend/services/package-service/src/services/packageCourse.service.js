import { PrismaClient } from '@prisma/client';

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
    
    // Untuk package tipe BEGINNER dan INTERMEDIATE, izinkan semua penambahan course
    if (package_.type === 'BEGINNER' || package_.type === 'INTERMEDIATE') {
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
      '00000000-0000-0000-0000-000000000001': 'Intro to Web Development',
      '00000000-0000-0000-0000-000000000002': 'Intermediate JavaScript',
      '00000000-0000-0000-0000-000000000003': 'React Fundamentals',
      '00000000-0000-0000-0000-000000000004': 'NodeJS Basics',
      '00000000-0000-0000-0000-000000000005': 'Full Stack Development',
    };

    return packageCourses.map(pc => ({
      courseId: pc.courseId,
      title: dummyCourseMap[pc.courseId] || `Course ${pc.courseId}`,
      packageId: pc.packageId
    }));
  },
  
  /**
   * Format respons course berdasarkan tipe package
   * @param {Array} courses - Daftar course dengan data lengkap
   * @param {string} packageType - Tipe package (BEGINNER, INTERMEDIATE, BUNDLE)
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