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
   */
  static async validateCourseAvailability(courseId, packageType) {
    try {
      // Import CourseService at the top level to avoid circular dependencies
      const { CourseService } = await import('./course.service.js');
      
      // Get course information including quota details
      const course = await CourseService.getCourseById(courseId);
      if (!course) {
        return { valid: false, message: 'Kelas tidak ditemukan' };
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
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { status: 'APPROVED' }
    });

    // Enhance payment with price information
    const [enhancedPayment] = await this.enhancePaymentsWithPrice([updatedPayment]);
    return enhancedPayment;
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
   */
  static async checkEnrollmentStatus(paymentId) {
    try {
      // If enrollment service is not yet available, check for enrollment record in queue
      const enrollmentQueuePath = process.env.ENROLLMENT_QUEUE_PATH;
      
      if (!enrollmentQueuePath) {
        // Default response when enrollment service is not available
        return { enrolled: false };
      }
      
      // For now, just check if any files in enrollment-queue directory match this payment ID
      // When enrollment service is ready, replace this with a call to enrollment service API
      
      // If payment is approved, consider it enrolled
      const payment = await this.getPaymentById(paymentId);
      if (payment && payment.status === 'APPROVED') {
        return { enrolled: true };
      }
      
      // Otherwise, not yet enrolled
      return { enrolled: false };
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
}
