/**
 * Utility untuk mengelola integrasi dengan enrollment service
 * Saat ini enrollment service belum dibuat, sehingga kode ini menyediakan
 * pendekatan untuk merekam informasi yang diperlukan ketika enrollment service
 * sudah siap.
 */
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PaymentService } from '../services/payment.service.js';

// Mendapatkan path absolut untuk menyimpan data enrollment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const enrollmentQueuePath = path.join(__dirname, '..', '..', 'enrollment-queue');

/**
 * Membuat direktori enrollment-queue jika belum ada
 */
const initEnrollmentQueueDir = async () => {
  try {
    await fs.mkdir(enrollmentQueuePath, { recursive: true });
    console.log(`✅ Enrollment queue directory created at ${enrollmentQueuePath}`);
  } catch (error) {
    console.error(`❌ Error creating enrollment queue directory: ${error.message}`);
  }
};

// Pastikan direktori enrollment-queue ada
initEnrollmentQueueDir();

/**
 * Mengirim notifikasi ke enrollment service untuk membuat pendaftaran baru
 * @param {Object} payment - Data pembayaran yang sudah disetujui
 * @returns {Promise<Object>} Status enrollment
 */
export const createEnrollmentAfterPayment = async (payment) => {
  try {
    // Karena enrollment service belum ada, kita akan menyimpan data pembayaran yang diapprove
    // ke dalam file untuk diproses nanti oleh enrollment service

    // Get package info to determine if it's a bundle
    const packageInfo = await PaymentService.getPackageInfo(payment.packageId);
    const isBundle = packageInfo && packageInfo.type === 'BUNDLE';
    
    // Format data payment for enrollment
    const baseEnrollmentData = {
      paymentId: payment.id,
      userId: payment.userId,
      packageId: payment.packageId,
      packageType: packageInfo ? packageInfo.type : 'UNKNOWN',
      price: payment.price || 0,
      approvedAt: new Date(),
    };

    // For bundle packages, get all courses in the package
    if (isBundle) {
      // Get all courses in the bundle package
      const coursesInBundle = await PaymentService.getCoursesInPackage(payment.packageId);
      
      // Create enrollment data for each course in the bundle
      const bundleEnrollmentData = {
        ...baseEnrollmentData,
        isBundle: true,
        courses: coursesInBundle,
        status: 'PENDING_ENROLLMENT'
      };
      
      // Save bundle enrollment data to file
      const filename = `bundle-${payment.id}-${Date.now()}.json`;
      const filepath = path.join(enrollmentQueuePath, filename);
      
      await fs.writeFile(
        filepath,
        JSON.stringify(bundleEnrollmentData, null, 2),
        'utf-8'
      );
      
      console.log(`✅ Bundle enrollment data saved to queue: ${filepath}`);
      
      return {
        status: 'queued',
        message: 'Bundle enrollment queued for processing',
        queueFile: filename
      };
    } else {
      // For ENTRY and INTERMEDIATE packages, create enrollment only for selected course
      // Format data payment for enrollment
      const enrollmentData = {
        ...baseEnrollmentData,
        isBundle: false,
        courseId: payment.courseId, // Only one course for non-bundle
        status: 'PENDING_ENROLLMENT'
      };

      // Save to file in JSON format
      const filename = `${payment.id}-${Date.now()}.json`;
      const filepath = path.join(enrollmentQueuePath, filename);
      
      await fs.writeFile(
        filepath,
        JSON.stringify(enrollmentData, null, 2),
        'utf-8'
      );
      
      console.log(`✅ Enrollment data saved to queue: ${filepath}`);
      
      return {
        status: 'queued',
        message: 'Enrollment queued for processing',
        queueFile: filename
      };
    }
    
  } catch (error) {
    console.error('❌ Error creating enrollment queue:', error.message);
    throw error;
  }
};

/**
 * Fungsi untuk diimplementasikan di enrollment service nanti
 * Ini adalah template yang dapat digunakan saat enrollment service dibuat
 * @param {string} paymentId - ID pembayaran yang disetujui
 */
export const handlePaymentApprovedInEnrollmentService = async (paymentId) => {
  try {
    // 1. Dapatkan data payment dari payment service
    // const payment = await getPaymentDetails(paymentId);
    
    // 2. Dapatkan informasi package untuk mengetahui tipenya
    // const packageInfo = await getPackageInfo(payment.packageId);
    
    // 3. Buat enrollment sesuai tipe package
    // if (packageInfo.type === 'BUNDLE') {
    //   // Untuk bundle, dapatkan semua course dalam package
    //   const coursesInPackage = await getAllCoursesInPackage(payment.packageId);
    //   
    //   // Buat enrollment untuk semua course dalam bundle
    //   for (const course of coursesInPackage) {
    //     await createEnrollment({
    //       userId: payment.userId,
    //       courseId: course.courseId,
    //       paymentId: payment.id,
    //       status: 'ACTIVE'
    //     });
    //   }
    // } else {
    //   // Untuk ENTRY dan INTERMEDIATE, buat enrollment hanya untuk course yang dipilih
    //   await createEnrollment({
    //     userId: payment.userId,
    //     courseId: payment.courseId,
    //     paymentId: payment.id,
    //     status: 'ACTIVE'
    //   });
    // }
    
    return {
      status: 'success',
      message: 'Enrollment created successfully'
    };
    
  } catch (error) {
    console.error('Error handling payment in enrollment service:', error.message);
    throw error;
  }
};