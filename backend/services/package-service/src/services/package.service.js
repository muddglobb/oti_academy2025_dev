import { PrismaClient } from '@prisma/client';

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
   * Mendapatkan semua package
   * @returns {Promise<Array>} Daftar semua package
   */
  async getAllPackages() {
    return await prisma.package.findMany({
      include: {
        courses: true
      }
    });
  },

  /**
   * Mendapatkan package berdasarkan ID
   * @param {string} id - ID package
   * @returns {Promise<Object|null>} Package yang ditemukan atau null
   */
  async getPackageById(id) {
    return await prisma.package.findUnique({
      where: { id },
      include: {
        courses: true
      }
    });
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