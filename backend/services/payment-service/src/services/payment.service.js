import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/**
 * Payment Service - Handles all database operations related to payments
 */
export class PaymentService {
  /**
   * Generate a valid JWT token for service-to-service communication
   * @returns {string} JWT token
   */
  static generateServiceToken() {
    // Create a JWT token with service identity for inter-service communication
    const payload = {
      id: 'payment-service',
      role: 'SERVICE'
    };
    
    return jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
  }

  /**
   * Create a new payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Created payment
   */
  static async createPayment(paymentData) {
    return prisma.payment.create({
      data: paymentData
    });
  }
  
  /**
   * Get all payments with optional filtering
   * @param {Object} filters - Optional filters for payments
   * @returns {Promise<Array>} List of payments
   */
  static async getAllPayments(filters = {}) {
    const {
      status,
      type,
      backStatus,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = filters;
    
    const skip = (page - 1) * limit;
    
    // Build where conditions based on filters
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (backStatus) {
      where.backStatus = backStatus;
    }
    
    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }
    
    // Get paginated results
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.payment.count({ where })
    ]);

    // Enhance payments with package info and price
    const enhancedPayments = await this.enhancePaymentsWithPrice(payments);
    
    return {
      payments: enhancedPayments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  /**
   * Get payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Payment
   */
  static async getPaymentById(id) {
    const payment = await prisma.payment.findUnique({
      where: { id }
    });

    if (payment) {
      // Enhance payment with package info and price
      const [enhancedPayment] = await this.enhancePaymentsWithPrice([payment]);
      return enhancedPayment;
    }

    return null;
  }
  
  /**
   * Get payments by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User's payments
   */
  static async getPaymentsByUserId(userId) {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Enhance payments with package info and price
    return this.enhancePaymentsWithPrice(payments);
  }

  /**
   * Get user information by ID from auth-service
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User information
   */
  static async getUserInfo(userId) {
    try {
      // Validasi URL dan tentukan default jika environment variable tidak ada
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001';
      const jwtSecret = process.env.JWT_SECRET;
      
      // Pastikan URL dan JWT Secret valid sebelum memanggil API
      if (!authServiceUrl) {
        console.error('AUTH_SERVICE_URL is not defined');
        return null;
      }
      
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined');
        return null;
      }
      
      // Generate a valid JWT token for service-to-service communication
      const serviceToken = this.generateServiceToken();
      
      // Setup headers dengan JWT token yang valid
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      console.log('Making request to:', `${authServiceUrl}/users/${userId}`);
      
      // Call to Auth Service API to get user info with valid JWT token
      const response = await axios.get(`${authServiceUrl}/users/${userId}`, { headers });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user info:', error.message);
      // Log detail error untuk debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      return null;
    }
  }

  /**
   * Get multiple users information by IDs from auth-service
   * @param {string[]} userIds - Array of user IDs
   * @returns {Promise<Object>} Map of user information keyed by user ID
   */
  static async getBatchUserInfo(userIds) {
    try {
      // Remove duplicates from userIds
      const uniqueUserIds = [...new Set(userIds)];
      
      if (uniqueUserIds.length === 0) {
        return {};
      }

      // Validate URL and set default if environment variable is missing
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001';
      const jwtSecret = process.env.JWT_SECRET;
      
      // Ensure URL and JWT Secret are valid before calling API
      if (!authServiceUrl) {
        console.error('AUTH_SERVICE_URL is not defined');
        return {};
      }
      
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined');
        return {};
      }
      
      // Generate a valid JWT token for service-to-service communication
      const serviceToken = this.generateServiceToken();
      
      // Setup headers with JWT token
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      console.log('Making batch request to Auth Service for users:', uniqueUserIds.length);
      
      // Call to Auth Service API to get users info with comma-separated IDs
      const response = await axios.get(`${authServiceUrl}/users`, { 
        headers,
        params: { ids: uniqueUserIds.join(',') }
      });
      
      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        return {};
      }
      
      // Convert array of users to a map with userId as key
      const userMap = {};
      response.data.data.forEach(user => {
        if (user && user.id) {
          userMap[user.id] = user;
        }
      });
      
      return userMap;
    } catch (error) {
      console.error('Error batch fetching user info:', error.message);
      // Log detail error untuk debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      return {};
    }
  }

  /**
   * Get package information by ID
   * @param {string} packageId - Package ID
   * @returns {Promise<Object>} Package information
   */
  static async getPackageInfo(packageId) {
    try {
      // Validasi URL dan tentukan default jika environment variable tidak ada
      const packageServiceUrl = process.env.PACKAGE_SERVICE_URL || 'http://package-service-api:8005';
      const jwtSecret = process.env.JWT_SECRET;
      
      // Pastikan URL dan JWT Secret valid sebelum memanggil API
      if (!packageServiceUrl) {
        console.error('PACKAGE_SERVICE_URL is not defined');
        return null;
      }
      
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined');
        return null;
      }
      
      // Generate a valid JWT token for service-to-service communication
      const serviceToken = this.generateServiceToken();
      
      // Untuk debugging
      console.log('Package Service URL:', packageServiceUrl);
      console.log('JWT Token Generated:', serviceToken ? 'Yes' : 'No');
      
      // Setup headers dengan JWT token yang valid
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      console.log('Making request to:', `${packageServiceUrl}/packages/${packageId}`);
      
      // Call to Package Service API to get package info with valid JWT token
      const response = await axios.get(`${packageServiceUrl}/packages/${packageId}`, { headers });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching package info:', error.message);
      // Log detail error untuk debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
      return null;
    }
  }

  /**
   * Validasi bahwa courseId termasuk dalam packageId yang dipilih
   * @param {string} packageId - ID package
   * @param {string} courseId - ID course yang akan divalidasi
   * @returns {Promise<boolean>} Hasil validasi
   */
  static async validateCourseInPackage(packageId, courseId) {
    try {
      // Generate JWT token untuk service-to-service communication
      const serviceToken = this.generateServiceToken();
      
      // Set up headers dengan token
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      // URL untuk mengakses package-service API
      const packageServiceUrl = process.env.PACKAGE_SERVICE_URL || 'http://package-service-api:8005';
      
      // Panggil API package-service untuk mendapatkan daftar course dalam package
      const response = await axios.get(
        `${packageServiceUrl}/packages/${packageId}/courses`,
        { headers }
      );
      
      // Periksa apakah response valid dan memiliki data
      if (!response.data || !response.data.data) {
        return false;
      }
      
      // Ekstrak data courses dari response
      let courses = [];
      
      // Format response bisa berbeda tergantung tipe package
      if (response.data.data.courses) {
        courses = response.data.data.courses;
      } else if (response.data.data.bundlePairs) {
        // Untuk package tipe BUNDLE, courses ada dalam bundlePairs
        response.data.data.bundlePairs.forEach(pair => {
          courses = courses.concat(pair.courses);
        });
      }
      
      // Periksa apakah courseId ada dalam daftar courses
      return courses.some(course => course.courseId === courseId);
    } catch (error) {
      console.error('Error validating course in package:', error.message);
      // Log detail error untuk debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      return false;
    }
  }

  /**
   * Validasi quota course berdasarkan tipe package
   * @param {string} courseId - ID course yang akan divalidasi
   * @param {string} packageType - Tipe package (ENTRY, INTERMEDIATE, BUNDLE)
   * @returns {Promise<Object>} Hasil validasi dengan status dan pesan
   */  static async validateCourseAvailability(courseId, packageType) {
    try {
      // Import CourseService at the top level to avoid circular dependencies
      const { CourseService } = await import('./course.service.js');
      
      // Get course information including quota details
      const course = await CourseService.getCourseById(courseId);
      if (!course) {
        return { valid: false, message: 'Kelas tidak ditemukan' };
      }
      
      // If trying to enroll in a bundle but course doesn't support bundles
      if (packageType === 'BUNDLE' && course.bundleQuota === 0) {
        return { 
          valid: false, 
          message: `Kursus "${course.title}" tidak tersedia dalam paket bundle` 
        };
      }
      
      // Get total approved enrollments for this course
      const enrollmentCounts = await this.getCourseEnrollmentCount(courseId);
      
      // Check against the relevant quota based on package type
      if (packageType === 'BUNDLE') {
        if (enrollmentCounts.bundleCount >= course.bundleQuota) {
          return { 
            valid: false, 
            message: `Kuota kelas bundle untuk "${course.title}" sudah penuh (${enrollmentCounts.bundleCount}/${course.bundleQuota})` 
          };
        }
      } else { // ENTRY or INTERMEDIATE
        if (enrollmentCounts.entryIntermediateCount >= course.entryQuota) {
          return { 
            valid: false, 
            message: `Kuota kelas ${packageType.toLowerCase()} untuk "${course.title}" sudah penuh (${enrollmentCounts.entryIntermediateCount}/${course.entryQuota})` 
          };
        }
      }
      
      return { valid: true };
    } catch (error) {
      console.error('Error validating course availability:', error.message);
      return { valid: false, message: 'Gagal validasi ketersediaan kelas' };
    }
  }

/**
 * Mendapatkan jumlah pendaftaran untuk suatu course berdasarkan tipe package
 * @param {string} courseId - ID course
 * @returns {Promise<Object>} Jumlah pendaftaran per tipe package
 */
static async getCourseEnrollmentCount(courseId) {
  try {
    // Create a package type cache to avoid redundant API calls
    const packageTypeCache = new Map();
    const bundleCourseCache = new Map();
    
    // 1. Get direct enrollments (non-bundle) for this course
    const directPayments = await prisma.payment.findMany({
      where: {
        courseId,
        status: 'APPROVED'
      },
      select: {
        id: true,
        packageId: true
      }
    });
    
    // 2. Process direct payments with batch package info retrieval
    const uniquePackageIds = [...new Set(directPayments.map(p => p.packageId))];
    let entryIntermediateCount = 0;
    
    // Batch fetch package info for direct payments
    if (uniquePackageIds.length > 0) {
      await Promise.all(uniquePackageIds.map(async (packageId) => {
        if (!packageTypeCache.has(packageId)) {
          const packageInfo = await this.getPackageInfo(packageId);
          if (packageInfo) {
            packageTypeCache.set(packageId, packageInfo.type);
          }
        }
      }));
      
      // Count non-bundle enrollments
      for (const payment of directPayments) {
        const packageType = packageTypeCache.get(payment.packageId);
        if (packageType && packageType !== 'BUNDLE') {
          entryIntermediateCount++;
        }
      }
    }
    
    // 3. Get bundle enrollments more efficiently (only fetch bundle packages)
    const bundlePayments = await prisma.payment.findMany({
      where: {
        status: 'APPROVED'
      },
      select: {
        id: true,
        packageId: true
      }
    });
    
    // Get unique package IDs from all payments
    const allPackageIds = [...new Set(bundlePayments.map(p => p.packageId))];
    
    // Fetch package info for all packages in one batch
    await Promise.all(allPackageIds.map(async (packageId) => {
      if (!packageTypeCache.has(packageId)) {
        const packageInfo = await this.getPackageInfo(packageId);
        if (packageInfo) {
          packageTypeCache.set(packageId, packageInfo.type);
        }
      }
    }));
    
    // Filter to only bundle payments
    const bundlePackageIds = allPackageIds.filter(
      packageId => packageTypeCache.get(packageId) === 'BUNDLE'
    );
    
    // Batch fetch courses for all bundle packages
    let bundleCount = 0;
    await Promise.all(bundlePackageIds.map(async (packageId) => {
      try {
        const coursesInBundle = await this.getCoursesInPackage(packageId);
        bundleCourseCache.set(packageId, coursesInBundle);
      } catch (error) {
        console.error(`Error fetching courses for bundle ${packageId}:`, error.message);
      }
    }));
    
    // Count bundle enrollments
    for (const payment of bundlePayments) {
      const packageType = packageTypeCache.get(payment.packageId);
      if (packageType === 'BUNDLE') {
        const coursesInBundle = bundleCourseCache.get(payment.packageId) || [];
        const isCourseInBundle = coursesInBundle.some(c => String(c.id) === String(courseId));
        if (isCourseInBundle) {
          bundleCount++;
        }
      }
    }
    
    return {
      total: entryIntermediateCount + bundleCount,
      bundleCount,
      entryIntermediateCount
    };
  } catch (error) {
    console.error('Error getting course enrollment count:', error.message);
    return {
      total: 0,
      bundleCount: 0,
      entryIntermediateCount: 0
    };
  }
}

/**
 * Mendapatkan jumlah pendaftaran untuk semua courses
 * @returns {Promise<Object>} Jumlah pendaftaran per course dengan detailnya
 */
static async getAllCoursesEnrollmentCount() {
  try {
    // Dapatkan semua kursus dari course-service
    const { CourseService } = await import('./course.service.js');
    const allCourses = await CourseService.getAllCourses();
    
    if (!allCourses || !Array.isArray(allCourses) || allCourses.length === 0) {
      return {
        success: false,
        message: 'Tidak dapat mendapatkan daftar kursus',
        data: []
      };
    }
    
    // Dapatkan jumlah pendaftaran untuk setiap kursus secara paralel
    const enrollmentCountsPromises = allCourses.map(async (course) => {
      const enrollmentCount = await this.getCourseEnrollmentCount(course.id);
      
      return {
        id: course.id,
        title: course.title,
        level: course.level,
        quota: {
          total: course.quota || 0,
          entryQuota: course.entryQuota || 0,
          bundleQuota: course.bundleQuota || 0
        },
        enrollment: {
          total: enrollmentCount.total || 0,
          entryIntermediateCount: enrollmentCount.entryIntermediateCount || 0,
          bundleCount: enrollmentCount.bundleCount || 0
        },
        remaining: {
          entryIntermediate: (course.entryQuota || 0) - (enrollmentCount.entryIntermediateCount || 0),
          bundle: (course.bundleQuota || 0) - (enrollmentCount.bundleCount || 0)
        }
      };
    });
    
    const enrollmentCounts = await Promise.all(enrollmentCountsPromises);
    
    return {
      success: true,
      message: 'Data jumlah pendaftaran semua kursus berhasil didapatkan',
      data: enrollmentCounts
    };
    
  } catch (error) {
    console.error('Error getting all courses enrollment count:', error.message);
    return {
      success: false,
      message: 'Gagal mendapatkan data jumlah pendaftaran',
      data: []
    };
  }
}

  /**
   * Get user's existing payments with package information
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User's payments with package info
   */
  static async getUserPayments(userId) {
    // Get all payment records for the user
    const payments = await prisma.payment.findMany({
      where: { 
        userId,
        status: { in: ['PAID', 'APPROVED'] } // Only consider valid payments
      }
    });
    
    // Fetch package info for each payment
    const paymentsWithPackageInfo = await Promise.all(
      payments.map(async (payment) => {
        const packageInfo = await this.getPackageInfo(payment.packageId);
        return {
          ...payment,
          package: packageInfo || { type: 'UNKNOWN' }
        };
      })
    );
    
    return paymentsWithPackageInfo;
  }
  /**
   * Approve payment
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Updated payment
   */  
static async approvePayment(id) {
  // Step 1: Get payment details outside of transaction
  const payment = await prisma.payment.findUnique({
    where: { id }
  });
  
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  if (payment.status === 'APPROVED') {
    // Return payment details if already approved
    return this.getPaymentById(id);
  }
    // Step 2: Use a short transaction only for updating payment status
  // This avoids long-running transactions that could time out
  const updatedPayment = await prisma.$transaction(async (tx) => {
    return await tx.payment.update({
      where: { id },
      data: { 
        status: 'APPROVED',
        updatedAt: new Date() // Use updatedAt instead of approvedAt which doesn't exist in schema
      }
    });
  });
  
  // Step 3: Process enrollment and notifications outside of transaction
  try {
    // Get course IDs based on package type
    const { courseIds, packageInfo, courseNames } = await this.getEnrollmentInfo(payment);
    
    // Get user info
    const userInfo = await this.getUserInfo(payment.userId);
      // Process enrollment if we have courses
    if (courseIds.length > 0) {
      // We're handling this separately from the DB transaction
      await this.processEnrollment(payment, courseIds);

      // Send enrollment confirmation email
      const { sendEnrollmentConfirmationEmail } = await import('../utils/email-helper.js');
      await sendEnrollmentConfirmationEmail(
        payment,
        userInfo,
        packageInfo,
        courseNames
      );
      
      console.log(`✅ Enrollment confirmation email sent to ${userInfo.email}`);
    } else {
      // For bundle packages that might have placeholder courseId but no actual courses detected
      if (payment.courseId === '00000000-0000-0000-0000-000000000000' && packageInfo?.type === 'BUNDLE') {
        console.warn(`⚠️ Bundle package detected but no courses found. Attempting to get courses directly.`);
        
        // Try one more time to get courses directly from package service
        const coursesInPackage = await this.getCoursesInPackage(payment.packageId);
        
        if (coursesInPackage && Array.isArray(coursesInPackage) && coursesInPackage.length > 0) {
          console.log(`Found ${coursesInPackage.length} courses directly from package, proceeding with enrollment`);
          
          const validCourseIds = coursesInPackage
            .map(course => course.id || course.courseId)
            .filter(id => id && id !== '00000000-0000-0000-0000-000000000000');
            
          if (validCourseIds.length > 0) {
            // Process enrollment with the recovered course IDs
            await this.processEnrollment(payment, validCourseIds);
            
            // Get course names for email
            const courseNamePromises = validCourseIds.map(id => this.getCourseTitle(id));
            const recoveredCourseNames = (await Promise.all(courseNamePromises)).filter(Boolean);
            
            // Send enrollment confirmation email
            const { sendEnrollmentConfirmationEmail } = await import('../utils/email-helper.js');
            await sendEnrollmentConfirmationEmail(
              payment,
              userInfo,
              packageInfo,
              recoveredCourseNames
            );
            
            console.log(`✅ Enrollment confirmation email sent to ${userInfo.email} after recovery`);
          } else {
            console.error(`❌ No valid course IDs found in bundle package ${payment.packageId}`);
          }
        } else {
          console.warn(`⚠️ No courses found for bundle payment ${id}, skipping enrollment`);
        }
      } else {
        console.warn(`⚠️ No courses found for payment ${id}, skipping enrollment`);
      }
    }
  } catch (postApprovalError) {
    // Log the error but don't fail the approval since payment is already approved
    console.error(`⚠️ Post-approval processing error: ${postApprovalError.message}`);
    console.error('Payment was approved, but enrollment or email notification had issues.');
    
    // Optional: Create a record of the failure for retry
    try {
      await this.createPostApprovalRetry(id, postApprovalError);
    } catch (retryError) {
      console.error('Failed to create retry record:', retryError);
    }
  }
  
  // Enhance payment with price information
  const [enhancedPayment] = await this.enhancePaymentsWithPrice([updatedPayment]);
  return enhancedPayment;
}

/**
 * Create a record for retrying post-approval tasks
 * @param {string} paymentId - Payment ID
 * @param {Error} error - Error that occurred
 */
static async createPostApprovalRetry(paymentId, error) {
  try {
    // This is just logging to a file, but could be implemented as a database record
    console.log(`Creating retry record for payment ${paymentId}: ${error.message}`);
    // In a real implementation, you might create a record in a separate table for retries
  } catch (error) {
    console.error('Failed to create retry record:', error);
  }
}  /**
 * Get enrollment information for a payment
 * @param {Object} payment - Payment object
 * @returns {Promise<Object>} Course IDs, package info, and course names
 */
/**
 * Get enrollment information for a payment
 * @param {Object} payment - Payment object
 * @returns {Promise<Object>} Course IDs, package info, and course names
 */
static async getEnrollmentInfo(payment) {
  let courseIds = [];
  let courseNames = [];
  let packageInfo = null;
  
  // If this is a package, we need to determine which courses to enroll based on package type
  if (payment.packageId) {
    try {
      const packageServiceURL = process.env.PACKAGE_SERVICE_URL || 'http://package-service-api:8005';
      console.log('Package Service URL:', packageServiceURL);
      
      // Import retryWithBackoff and executeWithCircuitBreaker
      const { retryWithBackoff, executeWithCircuitBreaker } = await import('../utils/retry-helper.js');
      
      // Get package info with retry and circuit breaker
      const packageResponse = await executeWithCircuitBreaker('package', async () => {
        return await retryWithBackoff(async () => {
          return await axios.get(
            `${packageServiceURL}/packages/${payment.packageId}`,
            { headers: { 'Authorization': `Bearer ${this.generateServiceToken()}` } }
          );
        }, 3, 1000);
      });
      
      packageInfo = packageResponse.data?.data;
      const packageType = packageInfo?.type;
      console.log(`Package Type: ${packageType}`);
      
      // Only get all courses if it's a BUNDLE package
      if (packageType === 'BUNDLE') {
        // Bundle package handling stays the same
        console.log(`Getting all courses for BUNDLE package: ${payment.packageId}`);
        const coursesInPackage = await this.getCoursesInPackage(payment.packageId);
        
        if (coursesInPackage && Array.isArray(coursesInPackage) && coursesInPackage.length > 0) {
          console.log(`Found ${coursesInPackage.length} courses in bundle package ${payment.packageId}`);
          
          // Extract course IDs and names
          courseIds = [];
          courseNames = [];
          
          for (const course of coursesInPackage) {
            const courseId = course.id || course.courseId;
            if (courseId && courseId !== '00000000-0000-0000-0000-000000000000') {
              courseIds.push(courseId);
              
              // Try to get course name/title directly from the course object first
              const courseTitle = course.title || await this.getCourseTitle(courseId);
              if (courseTitle) courseNames.push(courseTitle);
            }
          }
        }
      } else if (payment.courseId && payment.courseId !== '00000000-0000-0000-0000-000000000000') {
        // For ENTRY or INTERMEDIATE packages, use only the selected course
        console.log(`Using selected course ${payment.courseId} for ${packageType} package`);
        courseIds = [payment.courseId];
        
        // Fixed: Get the course title directly rather than using getCourseDetailsWithRetry
        // which was returning just the title string, not an object
        const courseTitle = await this.getCourseTitle(payment.courseId);
        if (courseTitle) {
          console.log(`Successfully fetched course title: ${courseTitle}`);
          courseNames = [courseTitle];
        } else {
          console.warn(`⚠️ Failed to get title for course ${payment.courseId}, using fallback`);
          // Fallback: Get course from package-service
          const coursesInPackage = await this.getCoursesInPackage(payment.packageId);
          const selectedCourse = coursesInPackage.find(
            c => c.id === payment.courseId || c.courseId === payment.courseId
          );
          
          if (selectedCourse && selectedCourse.title) {
            courseNames = [selectedCourse.title];
            console.log(`Using fallback course title from package: ${selectedCourse.title}`);
          } else {
            // Last resort fallback - use course ID if we can't get the title
            console.warn(`⚠️ Could not get course title from any source, using ID as fallback`);
            courseNames = [`Course ID: ${payment.courseId.substring(0, 8)}...`];
          }
        }
      }
    } catch (packageError) {
      console.error('Error fetching package info:', packageError);
      // Fallback: if it's a single course purchase, use the courseId directly
      if (payment.courseId && payment.courseId !== '00000000-0000-0000-0000-000000000000') {
        courseIds = [payment.courseId];
        
        // Try to get course name/title
        try {
          const courseTitle = await this.getCourseTitle(payment.courseId);
          if (courseTitle) courseNames = [courseTitle];
        } catch (error) {
          console.error('Error getting course title:', error);
        }
      }
    }
  } else if (payment.courseId && payment.courseId !== '00000000-0000-0000-0000-000000000000') {
    // Single course purchase without package
    courseIds = [payment.courseId];
    
    // Try to get course name/title
    try {
      const courseTitle = await this.getCourseTitle(payment.courseId);
      if (courseTitle) courseNames = [courseTitle];
    } catch (error) {
      console.error('Error getting course title:', error);
    }
  }
  
  console.log(`Final courseNames for email: ${JSON.stringify(courseNames)}`);
  return { courseIds, packageInfo, courseNames };
}

static async getCourseDetailsWithRetry(courseId, maxRetries = 3) {
  const { retryWithBackoff } = await import('../utils/retry-helper.js');
  
  try {
    return await retryWithBackoff(async () => {
      const title = await this.getCourseTitle(courseId);
      if (!title) throw new Error('No course title returned');
      return title;
    }, maxRetries, 1000);
  } catch (error) {
    console.error(`Failed to get course title after ${maxRetries} attempts:`, error.message);
    return null;
  }
}

/**
 * Get course title by ID
 * @param {string} courseId - Course ID
 * @returns {Promise<string|null>} Course title or null if not found
 */
static async getCourseTitle(courseId) {
  try {
    // Generate service token for authentication
    const serviceToken = this.generateServiceToken();
    
    const courseServiceURL = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
    console.log(`Fetching course title from ${courseServiceURL}/courses/${courseId}`);
    
    const response = await axios.get(
      `${courseServiceURL}/courses/${courseId}`,
      { 
        headers: { 
          'Authorization': `Bearer ${serviceToken}`,
          'x-service-api-key': process.env.SERVICE_API_KEY 
        },
        timeout: 5000 // Increased timeout for reliability
      }
    );
    
    if (response.data && response.data.data && response.data.data.title) {
      console.log(`✅ Retrieved course title: ${response.data.data.title}`);
      return response.data.data.title;
    }
    console.warn(`⚠️ No title found in API response for course ${courseId}`);
    return null;
  } catch (error) {
    console.error(`❌ Error fetching course details: ${error.message}`);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    }
    return null;
  }
}

/**
 * Process enrollment for a payment
 * @param {Object} payment - Payment object
 * @param {string[]} courseIds - Course IDs to enroll
 * @returns {Promise<Object>} Enrollment response
 */
static async processEnrollment(payment, courseIds) {
  if (!courseIds || courseIds.length === 0) {
    throw new Error('No course IDs provided for enrollment');
  }
  
  // CRITICAL: Enrollment service availability check
  const enrollmentServiceURL = process.env.ENROLLMENT_SERVICE_URL || 'http://enrollment-service-api:8007';
  console.log(`Checking enrollment service availability at ${enrollmentServiceURL}...`);
  
  const enrollmentAvailable = await this.checkServiceAvailability(enrollmentServiceURL);
  if (!enrollmentAvailable) {
    console.error('❌ Enrollment service is not available!');
    throw new Error('Enrollment service is not available. Will try again later.');
  }
  console.log('✅ Enrollment service is available. Proceeding with enrollment.');
  
  // Import retryWithBackoff and executeWithCircuitBreaker
  const { retryWithBackoff, executeWithCircuitBreaker } = await import('../utils/retry-helper.js');
  
  // Process enrollment with retry and circuit breaker
  return await executeWithCircuitBreaker('enrollment', async () => {
    return await retryWithBackoff(async () => {
      console.log(`Sending enrollment request to ${enrollmentServiceURL}/enrollments/payment-approved`);
      
      const response = await axios.post(
        `${enrollmentServiceURL}/enrollments/payment-approved`,
        {
          userId: payment.userId,
          packageId: payment.packageId,
          courseIds: courseIds
        },
        { 
          headers: { 
            'x-service-api-key': process.env.SERVICE_API_KEY,
            'Authorization': `Bearer ${this.generateServiceToken()}` 
          },
          timeout: 8000 // 8 seconds timeout
        }
      );
      
      console.log(`✅ Successfully notified enrollment service for payment ${payment.id}. Response:`, 
        response.status, response.statusText);
      
      if (response.status !== 201) {
        throw new Error(`Enrollment service returned non-success status: ${response.status}`);
      }
      
      return response;
    }, 3, 2000); // 3 retries, starting with 2 second delay
  });
}
    /**
   * Check if a service is available/online
   * @param {string} serviceUrl - URL of the service to check
   * @returns {Promise<boolean>} Whether the service is available
   */
  static async checkServiceAvailability(serviceUrl) {
    try {
      // Try to reach the service's health endpoint
      const healthEndpoint = `${serviceUrl}/health`;
      console.log(`Checking service availability: ${healthEndpoint}`);
      
      // We use a short timeout to quickly fail if service is down
      const response = await axios.get(healthEndpoint, { 
        timeout: 2000,
        validateStatus: status => status < 500 // Only HTTP 5xx errors are considered unavailable
      });
      
      return response.status === 200;
    } catch (error) {
      console.error(`Service ${serviceUrl} is unavailable: ${error.message}`);
      
      // Try a second attempt with a more basic endpoint
      try {
        // Try to reach the service's root endpoint
        const response = await axios.get(serviceUrl, { timeout: 2000 });
        return response.status === 200;
      } catch (secondError) {
        console.error(`Service ${serviceUrl} is definitely unavailable: ${secondError.message}`);
        return false;
      }
    }
  }
  
  /**
   * Request back payment
   * @param {string} id - Payment ID
   * @param {Object} backData - Back payment data
   * @returns {Promise<Object>} Updated payment
   */
  static async requestBack(id, backData) {
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        backStatus: 'REQUESTED',
        ...backData
      }
    });

    // Enhance payment with price information
    const [enhancedPayment] = await this.enhancePaymentsWithPrice([updatedPayment]);
    return enhancedPayment;
  }
  
  /**
   * Complete back payment
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Updated payment
   */
  static async completeBack(id) {
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        backStatus: 'COMPLETED',
        backCompletedAt: new Date()
      }
    });

    // Enhance payment with price information
    const [enhancedPayment] = await this.enhancePaymentsWithPrice([updatedPayment]);
    return enhancedPayment;
  }

  /**
   * Delete payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise<void>}
   */
  static async deletePayment(id) {
    return prisma.payment.delete({
      where: { id }
    });
  }

  /**
   * Update payment details like proofLink or back payment info
   * @param {string} id - Payment ID
   * @param {Object} updateData - Data to update (proofLink and/or back payment info)
   * @param {string} userId - User ID from JWT token to ensure ownership
   * @returns {Promise<Object>} Updated payment
   */
  static async updatePayment(id, updateData, userId) {
    // First check if payment exists and belongs to this user
    const existingPayment = await prisma.payment.findUnique({
      where: { id }
    });

    if (!existingPayment) {
      throw new Error('Payment not found');
    }

    // Verify ownership - only allow the payment owner to update it
    if (existingPayment.userId !== userId) {
      throw new Error('You are not authorized to update this payment');
    }

    // Only allow updates if payment is in PAID status (not APPROVED)
    if (existingPayment.backStatus === 'COMPLETED') {
      throw new Error('Cannot update payment that has already been transferred back');
    }

    // Prepare update data
    const data = {};
    
    // Update proofLink if provided
    if (updateData.proofLink) {
      data.proofLink = updateData.proofLink;
    }
    
    // Update back payment info if provided and user is DIKE
    if (existingPayment.type === 'DIKE' && 
        updateData.backPaymentMethod && 
        updateData.backAccountNumber && 
        updateData.backRecipient) {
      data.backPaymentMethod = updateData.backPaymentMethod;
      data.backAccountNumber = updateData.backAccountNumber;
      data.backRecipient = updateData.backRecipient;
      data.backStatus = 'REQUESTED'; // Reset back status to REQUESTED when info changes
    }
    
    // Only proceed with update if there are changes
    if (Object.keys(data).length === 0) {
      return existingPayment;
    }
    
    // Update the payment
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data
    });

    // Enhance payment with package info and price
    const [enhancedPayment] = await this.enhancePaymentsWithPrice([updatedPayment]);
    return enhancedPayment;
  }

  /**
   * Enhance payments with price information from package
   * @param {Array} payments - List of payments
   * @returns {Promise<Array>} Enhanced payments with price info
   */
  static async enhancePaymentsWithPrice(payments) {
    return Promise.all(
      payments.map(async (payment) => {
        // Get package info to get price
        const packageInfo = await this.getPackageInfo(payment.packageId);
        
        // If package info is available, add price to payment
        if (packageInfo) {
          return {
            ...payment,
            packageName: packageInfo.name,
            packageType: packageInfo.type,
            price: packageInfo.price
          };
        }
        
        // Return original payment if package info not available
        return payment;
      })
    );
  }

  /**
   * Get courses in a package
   * @param {string} packageId - Package ID
   * @returns {Promise<Array>} List of courses in the package with id and title
   */
  static async getCoursesInPackage(packageId) {
    try {
      // Generate JWT token for service-to-service communication
      const serviceToken = this.generateServiceToken();
      
      // Set up headers with token
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      // URL for package-service API
      const packageServiceUrl = process.env.PACKAGE_SERVICE_URL || 'http://package-service-api:8005';
      
      // Call to Package Service API to get courses in package
      const response = await axios.get(`${packageServiceUrl}/packages/${packageId}/courses`, { headers });
      
      // Extract courses from response based on package type
      let courses = [];
      
      const responseData = response.data.data;
      
      if (!responseData) {
        return [];
      }
      
      // Format response depends on package type
      if (responseData.courses) {
        // For ENTRY or INTERMEDIATE packages
        courses = responseData.courses.map(course => ({
          id: course.courseId,
          title: course.title || 'Untitled Course',
          description: course.description || null,
          level: course.level || null
        }));
      } else if (responseData.bundlePairs) {
        // For BUNDLE packages
        responseData.bundlePairs.forEach(pair => {
          if (pair.courses) {
            const mappedCourses = pair.courses.map(course => ({
              id: course.courseId,
              title: course.title || 'Untitled Course',
              description: course.description || null,
              level: course.level || null
            }));
            courses = courses.concat(mappedCourses);
          }
        });
      }
      
      return courses;
    } catch (error) {
      console.error('Error fetching courses in package:', error.message);
      // Log detailed error for debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      // Return empty array as fallback
      return [];
    }
  }

  /**
   * Check enrollment status for a payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Enrollment status
   */  static async checkEnrollmentStatus(paymentId) {
    try {
      if (!paymentId) {
        console.error('Payment ID is required to check enrollment status');
        return { enrolled: false };
      }
      
      // Get payment details first
      const payment = await this.getPaymentById(paymentId);
      
      if (!payment) {
        console.error('Payment not found with ID:', paymentId);
        return { enrolled: false };
      }
      
      if (payment.status !== 'APPROVED') {
        // If payment is not approved, it's definitely not enrolled
        return { enrolled: false };
      }
      
      // For approved payments, check with enrollment service via the helper
      const { checkEnrollmentStatus } = await import('../utils/enrollment-helper.js');
      
      if (payment.courseId) {
        // For single course payments, check direct enrollment
        const status = await checkEnrollmentStatus(payment.userId, payment.courseId);
        return { enrolled: !!status.isEnrolled };
      } else {
        // For bundle payments, we would need to check each course
        // This is simplified - in a real implementation you might want to check the package courses
        // For now we'll consider an approved payment as enrolled
        return { enrolled: true };
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error.message);
      return { enrolled: false };
    }
  }

  /**
   * Format payments for list view with user information
   * @param {Array} payments - List of payments
   * @param {Object} userInfoMap - Map of user information keyed by user ID
   * @returns {Array} Formatted payments with user information
   */
  static formatPaymentsForList(payments, userInfoMap) {
    return payments.map(payment => {
      const user = userInfoMap[payment.userId] || { 
        name: 'Unknown User',
        email: 'unknown@example.com',
        type: 'UNKNOWN'
      };
      
      return {
        ...payment,
        userName: user.name,
        userEmail: user.email,
        userType: user.type
      };
    });
  }

  /**
   * Format detailed payment with all required information
   * @param {Object} payment - Payment object
   * @param {Object} userInfo - User information
   * @returns {Object} Detailed payment with user and course info
   */
  static async formatDetailedPayment(payment, userInfo) {
    // Get courses information if needed
    let courseInfo = null;
    let allCoursesInPackage = [];

    // If payment has a courseId, get course info from course-service
    if (payment.courseId) {
      // Import CourseService at the top level to avoid circular dependencies
      const { CourseService } = await import('./course.service.js');
      
      try {
        // Fetch course directly from course service
        const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
        const serviceToken = this.generateServiceToken();
        
        const headers = {
          'Authorization': `Bearer ${serviceToken}`
        };
        
        console.log(`Making direct API call to course service for ID: ${payment.courseId}`);
        const response = await axios.get(`${courseServiceUrl}/courses/${payment.courseId}`, { headers });
        
        if (response.data && response.data.data) {
          const courseData = response.data.data;
          courseInfo = {
            id: payment.courseId,
            title: courseData.title || `Course ${payment.courseId.substring(0, 8)}`,
            description: courseData.description || '',
            level: courseData.level || null
          };
          console.log(`Retrieved course title: ${courseInfo.title}`);
        } else {
          // Try getting course info from package-service as fallback
          const coursesInPackage = await this.getCoursesInPackage(payment.packageId);
          const matchingCourse = coursesInPackage.find(c => c.id === payment.courseId);
          
          if (matchingCourse) {
            console.log(`Found course info in package: ${matchingCourse.title}`);
            courseInfo = {
              id: payment.courseId,
              title: matchingCourse.title,
              description: matchingCourse.description || '',
              level: matchingCourse.level || null
            };
          } else {
            courseInfo = {
              id: payment.courseId,
              title: `Course ${payment.courseId.substring(0, 8)}`  // Show truncated ID as fallback
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching course details: ${error.message}`);
        courseInfo = {
          id: payment.courseId,
          title: `Course ${payment.courseId.substring(0, 8)}`  // Show truncated ID as fallback
        };
      }
    }

    // For bundle packages, get all courses in the bundle
    if (payment.packageType === 'BUNDLE') {
      // Get courses from the package-service
      allCoursesInPackage = await this.getCoursesInPackage(payment.packageId);
    }

    // Check enrollment status
    const enrollmentStatus = await this.checkEnrollmentStatus(payment.id);

    // Format detailed payment
    return {
      ...payment,
      user: userInfo ? {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        type: userInfo.type
      } : { name: 'Unknown User', email: 'unknown@example.com', type: 'UNKNOWN' },
      course: courseInfo,
      bundleCourses: payment.packageType === 'BUNDLE' ? allCoursesInPackage : null,
      enrollmentStatus: enrollmentStatus.enrolled,
      paymentDate: payment.createdAt
    };
  }

  /**
   * Create enrollment queue file as backup mechanism
   * @param {Object} payment - Payment object
   * @returns {Promise<void>}
   */
}
