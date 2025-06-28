import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { EnrollmentService } from './enrollment.service.js';
import { sendPaymentConfirmationEmail } from '../utils/email-helper.js';

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
    isGroupPayment
  } = filters;
  
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

  if (typeof isGroupPayment === 'boolean') {
    where.isGroupPayment = isGroupPayment;
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
  
  const payments = await prisma.payment.findMany({
    where,
    orderBy: [
      { createdAt: 'desc' }
    ]
  });

  // Custom sorting untuk memastikan APPROVED di atas, PAID di bawah
  const sortedPayments = payments.sort((a, b) => {
    // Define status priority: APPROVED = 1, PAID = 2, others = 3
    const getStatusPriority = (status) => {
      switch (status) {
        case 'APPROVED': return 2;
        case 'PAID': return 1;
        default: return 3;
      }
    };
    
    const priorityA = getStatusPriority(a.status);
    const priorityB = getStatusPriority(b.status);
    
    // Sort by status priority first
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // If same status, sort by group payment (group payments first)
    if (a.isGroupPayment !== b.isGroupPayment) {
      return b.isGroupPayment - a.isGroupPayment;
    }
    
    // If same status and group type, sort by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Enhance payments with package info and price
  const enhancedPayments = await this.enhancePaymentsWithPrice(sortedPayments);
  
  // Get unique user IDs from payments
  const userIds = [...new Set(enhancedPayments.map(p => p.userId))];
  
  // Batch fetch user info
  const userInfoMap = await this.getBatchUserInfo(userIds);
  
  // Format payments with user information
  const formattedPayments = this.formatPaymentsForList(enhancedPayments, userInfoMap);
  
  return {
    payments: formattedPayments,
    total: formattedPayments.length
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
 * Get payments by user ID - UNIFIED RESPONSE FORMAT
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User's payments with consistent format
 */
static async getPaymentsByUserId(userId) {
  const payments = await prisma.payment.findMany({
    where: { 
      OR: [
        { userId }, // User sebagai pembuat payment
        { 
          AND: [
            { isGroupPayment: true },
            { invitedUserIds: { array_contains: userId } } // User sebagai invited member
          ]
        }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  // console.log(`🔍 Found ${payments.length} payments for user ${userId} (including group payments)`);

  // Enhance payments with package info and price
  const enhancedPayments = await this.enhancePaymentsWithPrice(payments);
  
  // Format all payments with unified structure, passing the requesting userId
  return Promise.all(
    enhancedPayments.map(async (payment) => {
      return await this.formatDetailedPayment(payment, userId); // Pass userId as requesting user
    })
  );
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
      
      // console.log('Making request to:', `${authServiceUrl}/users/${userId}`);
      
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
      
      // console.log('Making batch request to Auth Service for users:', uniqueUserIds.length);
      
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
      // Use the cache helper to get or set package info
      const { getPackageInfoCached } = await import('../utils/cache-helper.js');
        // Import circuit breaker utilities
      const { executeWithCircuitBreaker, retryWithBackoff } = await import('../utils/circuit-breaker.js');
      
      return await getPackageInfoCached(packageId, async () => {
        // This function only runs on cache miss
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
        
        // Setup headers dengan JWT token yang valid
        const headers = {
          'Authorization': `Bearer ${serviceToken}`
        };
        
        // console.log('Cache miss - making request to:', `${packageServiceUrl}/packages/${packageId}`);
        
        // Call to Package Service API with circuit breaker and retry
        return executeWithCircuitBreaker('package', async () => {
          const response = await retryWithBackoff(async () => {
            return await axios.get(`${packageServiceUrl}/packages/${packageId}`, { headers });
          }, 3, 1000);
          
          return response.data.data;
        });
      });
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
    
    // Use env variables with fallback to new quota values
    const entryQuota = course.entryQuota || 0;
    const bundleQuota = course.bundleQuota || 0;
    
    // If trying to enroll in a bundle but course doesn't support bundles
    if (packageType === 'BUNDLE' && bundleQuota === 0) {
      return { 
        valid: false, 
        message: `Kursus "${course.title}" tidak tersedia dalam paket bundle` 
      };
    }
    
    // Get both approved and pending enrollment counts for this course
    const approvedCounts = await this.getCourseEnrollmentCount(courseId);
    
    // Also check pending payments (status 'PAID')
    const pendingCounts = await this.getCoursePendingEnrollmentCount(courseId);
    
    // Total counts including pending payments
    const totalCounts = {
      total: approvedCounts.total + pendingCounts.total,
      bundleCount: approvedCounts.bundleCount + pendingCounts.bundleCount,
      entryIntermediateCount: approvedCounts.entryIntermediateCount + pendingCounts.entryIntermediateCount
    };
    
    // Check against the relevant quota based on package type
    if (packageType === 'BUNDLE') {
      if (totalCounts.bundleCount >= bundleQuota) {
        return { 
          valid: false, 
          message: `Kuota kelas bundle untuk "${course.title}" sudah penuh (${totalCounts.bundleCount}/${bundleQuota}). Total kuota minimal: ${entryQuota + bundleQuota}` 
        };
      }
    } else { // ENTRY or INTERMEDIATE
      if (totalCounts.entryIntermediateCount >= entryQuota) {
        return { 
          valid: false, 
          message: `Kuota kelas ${packageType.toLowerCase()} untuk "${course.title}" sudah penuh (${totalCounts.entryIntermediateCount}/${entryQuota}). Total kuota minimal: ${entryQuota + bundleQuota}` 
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
 * Mendapatkan jumlah pending payment untuk suatu course berdasarkan tipe package
 * @param {string} courseId - ID course
 * @returns {Promise<Object>} Jumlah pending payment per tipe package
 */
static async getCoursePendingEnrollmentCount(courseId) {
  try {
    // Get all pending payments (status 'PAID') that include this course
    
    // 1. Get direct pending payments for this specific course
    const directPendingPayments = await prisma.payment.findMany({
      where: {
        courseId,
        status: 'PAID'
      },
      select: {
        id: true,
        packageId: true,
        userId: true,
        isGroupPayment: true,
        memberCourses: true // For group payments with per-member courses
      }
    });
    
    // 2. Get group payments with per-member course selection that include this course
    const groupPendingPayments = await prisma.payment.findMany({
      where: {
        status: 'PAID',
        isGroupPayment: true,
        courseId: null // Group payments have null courseId
      },
      select: {
        id: true,
        packageId: true,
        memberCourses: true
      }
    });
    
    // 3. Get bundle payments that might include this course
    const bundlePendingPayments = await prisma.payment.findMany({
      where: {
        status: 'PAID',
        courseId: '00000000-0000-0000-0000-000000000000' // Bundle payments use zero UUID
      },
      select: {
        id: true,
        packageId: true,
        userId: true
      }
    });
    
    // Get all relevant package IDs for batch processing
    const allPackageIds = [
      ...new Set([
        ...directPendingPayments.map(p => p.packageId),
        ...groupPendingPayments.map(p => p.packageId),
        ...bundlePendingPayments.map(p => p.packageId)
      ])
    ];
    
    // Batch fetch package info
    const { batchPreloadPackageInfo } = await import('../utils/cache-helper.js');
    await batchPreloadPackageInfo(allPackageIds, async (packageId) => {
      return await this.getPackageInfo(packageId);
    });
    
    const packageTypeCache = new Map();
    
    // Load package types into cache
    await Promise.all(allPackageIds.map(async (packageId) => {
      const packageInfo = await this.getPackageInfo(packageId);
      if (packageInfo) {
        packageTypeCache.set(packageId, packageInfo.type);
      }
    }));
    
    let entryIntermediateCount = 0;
    let bundleCount = 0;
    
    // Count direct pending payments
    for (const payment of directPendingPayments) {
      const packageType = packageTypeCache.get(payment.packageId);
      
      if (payment.isGroupPayment && payment.memberCourses) {
        // For group payments, count only members enrolled in this specific course
        const membersInThisCourse = payment.memberCourses.filter(mc => mc.courseId === courseId);
        const count = membersInThisCourse.length;
        
        if (packageType === 'BUNDLE') {
          bundleCount += count;
        } else if (packageType === 'ENTRY' || packageType === 'INTERMEDIATE') {
          entryIntermediateCount += count;
        }
      } else {
        // Regular individual payment
        if (packageType === 'BUNDLE') {
          bundleCount += 1;
        } else if (packageType === 'ENTRY' || packageType === 'INTERMEDIATE') {
          entryIntermediateCount += 1;
        }
      }
    }
    
    // Count group payments with per-member course selection
    for (const payment of groupPendingPayments) {
      const packageType = packageTypeCache.get(payment.packageId);
      
      if (payment.memberCourses && Array.isArray(payment.memberCourses)) {
        const membersInThisCourse = payment.memberCourses.filter(mc => mc.courseId === courseId);
        const count = membersInThisCourse.length;
        
        if (packageType === 'BUNDLE') {
          bundleCount += count;
        } else if (packageType === 'ENTRY' || packageType === 'INTERMEDIATE') {
          entryIntermediateCount += count;
        }
      }
    }
    
    // Count bundle payments
    for (const payment of bundlePendingPayments) {
      const packageType = packageTypeCache.get(payment.packageId);
      
      if (packageType === 'BUNDLE') {
        // Check if this course is in the bundle
        const coursesInBundle = await this.getCoursesInPackage(payment.packageId);
        const isCourseInBundle = coursesInBundle.some(c => String(c.id) === String(courseId));
        
        if (isCourseInBundle) {
          bundleCount += 1;
        }
      }
    }
    
    return {
      total: entryIntermediateCount + bundleCount,
      bundleCount,
      entryIntermediateCount
    };
  } catch (error) {
    console.error('Error getting course pending enrollment count:', error.message);
    return {
      total: 0,
      bundleCount: 0,
      entryIntermediateCount: 0
    };
  }
}

/**
 * Mendapatkan jumlah pendaftaran untuk suatu course berdasarkan tipe package
 * @param {string} courseId - ID course
 * @returns {Promise<Object>} Jumlah pendaftaran per tipe package
 */
static async getCourseEnrollmentCount(courseId) {
  try {
    // Use cache helper to get or calculate enrollment count
    const { getCourseEnrollmentCountCached, batchPreloadPackageInfo } = await import('../utils/cache-helper.js');
    
    return await getCourseEnrollmentCountCached(courseId, async () => {
      // console.log(`📊 Cache miss - calculating enrollment count for course ${courseId}`);
      
      // NEW APPROACH: Count actual enrollments from Enrollment table
      // This is more accurate for group payments with per-member course selection
      const enrollments = await prisma.enrollment.findMany({
        where: {
          courseId,
          status: 'ENROLLED'
        },
        select: {
          id: true,
          userId: true,
          packageId: true,
          paymentId: true
        }
      });
      
      // console.log(`🔍 Found ${enrollments.length} actual enrollments for course ${courseId}`);
      
      // Get unique package IDs for batch processing
      const uniquePackageIds = [...new Set(enrollments.map(e => e.packageId))];
      const packageTypeCache = new Map();
      
      // Batch fetch package info
      if (uniquePackageIds.length > 0) {
        await batchPreloadPackageInfo(uniquePackageIds, async (packageId) => {
          return await this.getPackageInfo(packageId);
        });
        
        // Load package types into cache
        await Promise.all(uniquePackageIds.map(async (packageId) => {
          if (!packageTypeCache.has(packageId)) {
            const packageInfo = await this.getPackageInfo(packageId);
            if (packageInfo) {
              packageTypeCache.set(packageId, packageInfo.type);
            }
          }
        }));
      }
      
      // Count enrollments by package type
      let entryIntermediateCount = 0;
      let bundleCount = 0;
      
      for (const enrollment of enrollments) {
        const packageType = packageTypeCache.get(enrollment.packageId);
        
        if (packageType === 'BUNDLE') {
          bundleCount += 1;
        } else if (packageType === 'ENTRY' || packageType === 'INTERMEDIATE') {
          entryIntermediateCount += 1;
        }
      }
      
      const finalResult = {
        total: entryIntermediateCount + bundleCount,
        bundleCount,
        entryIntermediateCount
      };
      
      // console.log(`📊 Final enrollment count for course ${courseId}:`, finalResult);
      
      return finalResult;
    });
  } catch (error) {
    console.error('Error getting course enrollment count:', error.message);
    return {
      total: 0,
      bundleCount: 0,
      entryIntermediateCount: 0
    };
  }
}

// Get total payments count with optimized performance
static async getPaymentsCounts() {
  try {
    // 1. Fetch all payments with their packageId in one query
    const payments = await prisma.payment.findMany({
      select: {
        status: true,
        packageId: true
      }
    });

    // 2. Extract unique package IDs to batch fetch package info
    const uniquePackageIds = [...new Set(payments.map(p => p.packageId))];
    const packageTypeMap = new Map();

    // 3. Batch preload package info to minimize API calls
    const { batchPreloadPackageInfo } = await import('../utils/cache-helper.js');
    await batchPreloadPackageInfo(uniquePackageIds, async (packageId) => {
      return await this.getPackageInfo(packageId);
    });

    // 4. Load package types into map (will use cache from previous step)
    await Promise.all(uniquePackageIds.map(async (packageId) => {
      const packageInfo = await this.getPackageInfo(packageId);
      if (packageInfo) {
        packageTypeMap.set(packageId, packageInfo.type);
      }
    }));

    // 5. Count with optimized logic
    let totalCount = 0;
    let approvedCount = 0;
    let pendingCount = 0;

    for (const payment of payments) {
      const packageType = packageTypeMap.get(payment.packageId);
      const weightFactor = packageType === 'BUNDLE' ? 2 : 1;

      totalCount += weightFactor;
      
      if (payment.status === 'APPROVED') {
        approvedCount += weightFactor;
      } else if (payment.status === 'PAID') {
        pendingCount += weightFactor;
      }
    }

    return {
      success: true,
      message: 'Payment counts retrieved successfully',
      data: {
        total: totalCount,
        approved: approvedCount,
        pending: pendingCount
      }
    };
  } catch (error) {
    console.error('Error getting payment counts:', error.message);
    return {
      success: false,
      message: 'Failed to get payment counts',
      data: {
        total: 0,
        approved: 0,
        pending: 0
      }
    };
  }
}

/**
 * Mendapatkan jumlah pendaftaran untuk semua courses
 * @returns {Promise<Object>} Jumlah pendaftaran per course dengan detailnya
 */
static async getAllCoursesEnrollmentCount() {
  try {
    // Use cache helper to get or calculate all enrollment counts
    const { getAllCoursesEnrollmentCountCached } = await import('../utils/cache-helper.js');
    
    // Use a distinct cache key for the entire result
    return await getAllCoursesEnrollmentCountCached('all-enrollments', async () => {
      // console.log('Cache miss - calculating enrollment counts for all courses');
      
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
        // Get all payments with PAID status (pending approval) that have a direct courseId
      const directPendingCounts = await prisma.payment.groupBy({
        by: ['courseId'],
        where: {
          status: 'PAID',
          courseId: {
            not: null,
            not: '00000000-0000-0000-0000-000000000000'
          }
        },
        _count: {
          _all: true
        }
      });
      
      // Initialize pending counts map with direct course payments
      const pendingCountsByCourse = new Map();
      
      // Process direct course counts and initialize map
      for (const { courseId, _count } of directPendingCounts) {
        pendingCountsByCourse.set(courseId, {
          total: _count._all,
          entryIntermediateCount: 0,
          bundleCount: 0
        });
      }
      
      // Get all direct pending payments to categorize by package type
      const pendingDirectPayments = await prisma.payment.findMany({
        where: {
          status: 'PAID',
          courseId: {
            not: null,
            not: '00000000-0000-0000-0000-000000000000'
          }
        },
        select: {
          courseId: true,
          packageId: true
        }
      });      // Get bundle pending payments with zero UUID courseId
      // For bundles, courseId is '00000000-0000-0000-0000-000000000000', not null
      const bundlePendingPayments = await prisma.payment.findMany({
        where: {
          status: 'PAID',
          courseId: '00000000-0000-0000-0000-000000000000'
        },
        select: {
          id: true,
          packageId: true
        }
      });
      
      // Get all relevant package IDs for batch processing
      const allPackageIds = [
        ...new Set([
          ...pendingDirectPayments.map(p => p.packageId),
          ...bundlePendingPayments.map(p => p.packageId)
        ])
      ];
      
      // Batch fetch package info
      const { batchPreloadPackageInfo } = await import('../utils/cache-helper.js');
      await batchPreloadPackageInfo(allPackageIds, async (packageId) => {
        return await this.getPackageInfo(packageId);
      });
      
      // Process direct payments by package type
      for (const payment of pendingDirectPayments) {
        const packageInfo = await this.getPackageInfo(payment.packageId);
        const isBundle = packageInfo?.type === 'BUNDLE';
        
        // Get existing count or initialize if not exists
        if (!pendingCountsByCourse.has(payment.courseId)) {
          pendingCountsByCourse.set(payment.courseId, {
            total: 1,
            entryIntermediateCount: 0,
            bundleCount: 0
          });
        }
        
        const counts = pendingCountsByCourse.get(payment.courseId);
        
        // Update type-specific count
        if (isBundle) {
          counts.bundleCount += 1;
        } else {
          counts.entryIntermediateCount += 1;
        }
      }
      
      // Process bundle payments
      for (const payment of bundlePendingPayments) {
        const packageInfo = await this.getPackageInfo(payment.packageId);
        
        if (packageInfo?.type === 'BUNDLE') {
          // Get all courses in the bundle
          const coursesInBundle = await this.getCoursesInPackage(payment.packageId);
          
          if (coursesInBundle && Array.isArray(coursesInBundle) && coursesInBundle.length > 0) {
            // Increment counts for each course in the bundle
            for (const course of coursesInBundle) {
              if (course && course.id) {
                // Initialize or update count for this course
                if (!pendingCountsByCourse.has(course.id)) {
                  pendingCountsByCourse.set(course.id, {
                    total: 1,
                    entryIntermediateCount: 0,
                    bundleCount: 1
                  });
                } else {
                  const counts = pendingCountsByCourse.get(course.id);
                  counts.total += 1;
                  counts.bundleCount += 1;
                }
              }
            }
          } else {
            console.log(`No courses found in bundle package ${payment.packageId}`);
          }
        }
      }
      

            // Get payment counts using the getPaymentsCounts function
      const paymentCountsResult = await this.getPaymentsCounts();
      const paymentCounts = paymentCountsResult.success ? paymentCountsResult.data : {
        total: 0,
        approved: 0,
        pending: 0
      };
      
      // Dapatkan jumlah pendaftaran untuk setiap kursus secara paralel
      // This will use cached getCourseEnrollmentCount results when available
      const enrollmentCountsPromises = allCourses.map(async (course) => {
        const enrollmentCount = await this.getCourseEnrollmentCount(course.id);
        const pendingCount = pendingCountsByCourse.get(course.id) || {
          total: 0,
          entryIntermediateCount: 0,
          bundleCount: 0
        };
        
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
          pendingPayment: {
            total: pendingCount.total,
            entryIntermediateCount: pendingCount.entryIntermediateCount,
            bundleCount: pendingCount.bundleCount
          },
          totalPayment: {
            total: (enrollmentCount.total || 0) + pendingCount.total,
            entryIntermediateCount: (enrollmentCount.entryIntermediateCount || 0) + pendingCount.entryIntermediateCount,
            bundleCount: (enrollmentCount.bundleCount || 0) + pendingCount.bundleCount
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
        data: enrollmentCounts,
        paymentCounts: paymentCounts  
      };
    });
  } catch (error) {
    console.error('Error getting all courses enrollment count:', error.message);
    return {
      success: false,
      message: 'Gagal mendapatkan data jumlah pendaftaran',
      data: [],
      paymentCounts: 0
    };
  }
}

  static async getNeedToApprovePayments() {
    try {
      // Get all payments that are pending approval
      const payments = await prisma.payment.findMany({
        where: {
          status: 'PAID'
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Enhance payments with package info and price
      return this.enhancePaymentsWithPrice(payments);
    } catch (error) {
      console.error('Error getting payments to approve:', error.message);
      return [];
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
   * Approve payment and process enrollment 
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Updated payment with enrollment status
   */
  static async approvePayment(id) {
    try {
      // Use database transaction to ensure data consistency
      return await prisma.$transaction(async (tx) => {
        // Get payment first
        const payment = await tx.payment.findUnique({
          where: { id }
        });
        
        if (!payment) {
          throw new Error('Payment not found');
        }
        
        if (payment.status === 'APPROVED') {
          throw new Error('Payment is already approved');
        }
        
        // Update payment to approved
        const updatedPayment = await tx.payment.update({
          where: { id },
          data: {
            status: 'APPROVED',
            updatedAt: new Date()
          }
        });

        // Get package information and user information for email
        const packageInfo = await this.getPackageInfo(payment.packageId);
        const userInfo = await this.getUserInfo(payment.userId);
        
        // Determine which courses to enroll based on package type
        let courseIds = [];
        
        if (packageInfo && packageInfo.type === 'BUNDLE') {
          // For bundle packages, get all courses in the package
          const coursesInBundle = await this.getCoursesInPackage(payment.packageId);
          
          if (coursesInBundle && Array.isArray(coursesInBundle)) {
            courseIds = coursesInBundle.map(course => course.id).filter(Boolean);
          }
        } else if (payment.courseId) {
          // For ENTRY and INTERMEDIATE packages, use only the selected course
          courseIds = [payment.courseId];
        }
        
        // Create enrollments in the same transaction
        const enrollmentsData = courseIds.map(courseId => ({
          userId: payment.userId,
          courseId,
          paymentId: payment.id,
          packageId: payment.packageId,
          status: 'ENROLLED'
        }));
        
        // Create all enrollments in the transaction
        const enrollments = await Promise.all(
          enrollmentsData.map(data => tx.enrollment.create({ data }))
        );
        
        // Get course names for enrollment confirmation email
        const courseNames = await Promise.all(courseIds.map(async (courseId) => {
          try {
            const courseInfo = await this.getCourseInfo(courseId);
            return courseInfo?.title || 'Unknown Course';
          } catch (error) {
            return 'Unknown Course';
          }
        }));
        
        // Send ONLY enrollment confirmation email
        try {
          const { sendEnrollmentConfirmationEmail } = await import('../utils/email-helper.js');
          await sendEnrollmentConfirmationEmail(updatedPayment, userInfo, packageInfo, courseNames);
          console.log('Enrollment confirmation email sent successfully');
        } catch (emailError) {
          console.error('Failed to send enrollment confirmation email:', emailError.message);
          // Continue anyway since enrollment was successful
        }
        
        return {
          ...updatedPayment,
          enrollments
        };
      });
    } catch (error) {
      console.error('Error approving payment:', error.message);
      throw error;
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
 * Enhance payments with price information from package - OPTIMIZED VERSION
 * @param {Array} payments - List of payments
 * @returns {Promise<Array>} Enhanced payments with price info
 */
static async enhancePaymentsWithPrice(payments) {
  // Batch collect all unique user IDs and course IDs for optimization
  const allUserIds = new Set();
  const allCourseIds = new Set();
  
  payments.forEach(payment => {
    allUserIds.add(payment.userId);
    
    if (payment.courseId && payment.courseId !== '00000000-0000-0000-0000-000000000000') {
      allCourseIds.add(payment.courseId);
    }
    
    if (payment.isGroupPayment && payment.memberCourses && Array.isArray(payment.memberCourses)) {
      payment.memberCourses.forEach(mc => {
        allUserIds.add(mc.userId);
        allCourseIds.add(mc.courseId);
      });
    }
  });
  
  // Batch fetch user info and course info
  const userInfoMap = await this.getBatchUserInfo([...allUserIds]);
  const courseInfoMap = new Map();
  
  // Batch fetch course info
  await Promise.all([...allCourseIds].map(async (courseId) => {
    try {
      const courseInfo = await this.getCourseInfo(courseId);
      if (courseInfo) {
        courseInfoMap.set(courseId, courseInfo);
      }
    } catch (error) {
      console.error(`Error fetching course info for ${courseId}:`, error.message);
    }
  }));

  return Promise.all(
    payments.map(async (payment) => {
      // Get package info to get price
      const packageInfo = await this.getPackageInfo(payment.packageId);
      
      // Get course info for direct course enrollment
      let courseName = null;
      if (payment.courseId && payment.courseId !== '00000000-0000-0000-0000-000000000000') {
        const courseInfo = courseInfoMap.get(payment.courseId);
        courseName = courseInfo?.title || 'Unknown Course';
      } else if (packageInfo?.type === 'BUNDLE') {
        // For bundle payments, get all courses in the bundle
        const coursesInBundle = await this.getCoursesInPackage(payment.packageId);
        if (coursesInBundle && Array.isArray(coursesInBundle) && coursesInBundle.length > 0) {
          courseName = coursesInBundle.map(course => course.title).join(', ');
        }
      } else if (payment.isGroupPayment && payment.memberCourses) {
        // For group payments, show summary of courses from cache
        const uniqueCourseIds = [...new Set(payment.memberCourses.map(mc => mc.courseId))];
        const courseNames = uniqueCourseIds.map(courseId => {
          const courseInfo = courseInfoMap.get(courseId);
          return courseInfo?.title || 'Unknown Course';
        });
        courseName = courseNames.join(', ');
      }

      // Enhance memberCourses dengan course names dan user names dari cache
      let enhancedMemberCourses = null;
      if (payment.isGroupPayment && payment.memberCourses && Array.isArray(payment.memberCourses)) {
        enhancedMemberCourses = payment.memberCourses.map(memberCourse => {
          const courseInfo = courseInfoMap.get(memberCourse.courseId);
          const userInfo = userInfoMap[memberCourse.userId];
          
          return {
            ...memberCourse,
            courseName: courseInfo?.title || 'Unknown Course',
            userName: userInfo?.name || 'Unknown User',
            userEmail: userInfo?.email || 'unknown@example.com',
            role: memberCourse.userId === payment.userId ? 'creator' : 'member'
          };
        });
      }
      
      // Return enhanced payment dengan validasi
      const enhancedPayment = {
        ...payment,
        id: payment.id || 'unknown-payment',
        courseName: courseName || payment.courseName || 'Unknown Course',
        memberCourses: enhancedMemberCourses || payment.memberCourses || null,
        packageName: packageInfo?.name || 'Unknown Package',
        packageType: packageInfo?.type || 'UNKNOWN',
        price: packageInfo?.price || 0
      };

      return enhancedPayment;
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
      // Use the cache helper to get or set courses in package
      const { getCoursesInPackageCached } = await import('../utils/cache-helper.js');
        // Import circuit breaker utilities
      const { executeWithCircuitBreaker, retryWithBackoff } = await import('../utils/circuit-breaker.js');
      
      return await getCoursesInPackageCached(packageId, async () => {
        // This function only runs on cache miss
        // Generate JWT token for service-to-service communication
        const serviceToken = this.generateServiceToken();
        
        // Set up headers with token
        const headers = {
          'Authorization': `Bearer ${serviceToken}`
        };
        
        // URL for package-service API
        const packageServiceUrl = process.env.PACKAGE_SERVICE_URL || 'http://package-service-api:8005';
        
        // console.log('Cache miss - fetching courses for package:', packageId);
        
        // Call to Package Service API with circuit breaker and retry
        const response = await executeWithCircuitBreaker('package', async () => {
          return await retryWithBackoff(async () => {
            return await axios.get(`${packageServiceUrl}/packages/${packageId}/courses`, { headers });
          }, 3, 1000);
        });
        
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
      });
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
   * Get course information by ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} Course information
   */
  static async getCourseInfo(courseId) {
    try {
      // Import CourseService to avoid circular dependencies
      const { CourseService } = await import('./course.service.js');
      
      // Get course info using CourseService
      const courseInfo = await CourseService.getCourseById(courseId);
      
      if (courseInfo) {
        return courseInfo;
      }
      
      // If CourseService fails, try getting info from package courses as backup
      // console.log(`Course not found with ID ${courseId}, trying to find in packages`);
      
      // Get all active payments to check their packages
      const payments = await prisma.payment.findMany({
        where: { status: 'APPROVED' },
        distinct: ['packageId']
      });
      
      // Try to find the course in any package
      for (const payment of payments) {
        const coursesInPackage = await this.getCoursesInPackage(payment.packageId);
        const matchingCourse = coursesInPackage.find(c => c.id === courseId);
        
        if (matchingCourse) {
          console.log(`Found course info in package ${payment.packageId}: ${matchingCourse.title}`);
          return {
            id: courseId,
            title: matchingCourse.title,
            description: matchingCourse.description || '',
            level: matchingCourse.level || null
          };
        }
      }
      
      console.error(`No information found for course ${courseId} in any service`);
      return null;
    } catch (error) {
      console.error(`Error getting course info for ${courseId}:`, error.message);
      return null;
    }
  }

  /**
   * Check enrollment status for a payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object} Enrollment status
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
      id: 'unknown-user',
      name: 'Unknown User',
      email: 'unknown@example.com',
      phone: null,
      type: 'UNKNOWN'
    };
    
    // PERBAIKAN: Handle courseId untuk group payments
    let finalCourseId = payment.courseId;
    let finalCourseName = payment.courseName || 'Unknown Course';
    
    // Untuk group payments dengan memberCourses, ambil courseId creator
    if (payment.isGroupPayment && payment.memberCourses && Array.isArray(payment.memberCourses)) {
      // Cari course creator (pembuat payment)
      const creatorCourse = payment.memberCourses.find(mc => mc.userId === payment.userId);
      
      if (creatorCourse) {
        finalCourseId = creatorCourse.courseId;
        finalCourseName = creatorCourse.courseName || payment.courseName || 'Unknown Course';
      } else {
        // Fallback: gunakan course pertama jika creator tidak ditemukan
        finalCourseId = payment.memberCourses[0]?.courseId || 'group-courses';
        finalCourseName = payment.memberCourses[0]?.courseName || payment.courseName || 'Multiple Courses';
      }
    }
    
    // PERBAIKAN: Pastikan courseId tidak pernah null
    if (!finalCourseId || finalCourseId === 'null') {
      if (payment.packageType === 'BUNDLE') {
        finalCourseId = '00000000-0000-0000-0000-000000000000';
      } else if (payment.isGroupPayment) {
        finalCourseId = 'group-courses';
      } else {
        finalCourseId = 'unknown-course';
      }
    }
    
    return {
      ...payment,
      id: payment.id || 'unknown-payment',
      courseId: finalCourseId, // NEVER NULL - always has a valid value
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      userType: user.type,
      // Ensure course info is always present
      courseName: finalCourseName,
      packageName: payment.packageName || 'Unknown Package',
      packageType: payment.packageType || 'UNKNOWN',
      price: payment.price || 0,
      
      // TAMBAHAN: Info tambahan untuk group payments
      ...(payment.isGroupPayment && {
        groupPaymentInfo: {
          isGroupPayment: true,
          totalMembers: payment.totalParticipants || (payment.memberCourses?.length || 0),
          creatorCourse: payment.memberCourses?.find(mc => mc.userId === payment.userId) || null,
          allMemberCourses: payment.memberCourses || [],
          groupStatus: payment.groupStatus || 'PENDING'
        }
      })
    };
  });
}


/**
 * Format detailed payment with all required information
 * @param {Object} payment - Payment object
 * @param {string} requestingUserId - ID of user requesting the payment details
 * @returns {Object} Detailed payment with user and course info
 */
static async formatDetailedPayment(payment, requestingUserId) {
  // Get courses information if needed
  let courseInfo = null;
  let allCoursesInPackage = [];
  let finalCourseId = payment.courseId;

  // PERBAIKAN: Validasi awal courseId
  if (!finalCourseId || finalCourseId === 'null' || finalCourseId === 'undefined') {
    console.warn(`⚠️ Invalid courseId detected for payment ${payment.id}: ${finalCourseId}`);
    
    // Set courseId berdasarkan konteks payment
    if (payment.isGroupPayment && payment.memberCourses && Array.isArray(payment.memberCourses)) {
      // Untuk group payments, cari course untuk requesting user
      const userMemberCourse = payment.memberCourses.find(mc => mc.userId === requestingUserId);
      finalCourseId = userMemberCourse?.courseId || 'group-courses';
    } else if (payment.packageType === 'BUNDLE') {
      finalCourseId = '00000000-0000-0000-0000-000000000000';
    } else {
      finalCourseId = 'unknown-course';
    }
  }

  // PERBAIKAN: Handle group payments dengan per-member courses
  if (payment.isGroupPayment && payment.memberCourses && Array.isArray(payment.memberCourses)) {
    // For group payments, find the specific course for the requesting user
    const userMemberCourse = payment.memberCourses.find(mc => mc.userId === requestingUserId);
    
    if (userMemberCourse && userMemberCourse.courseId) {
      // Use the specific course for this user
      finalCourseId = userMemberCourse.courseId;
      
      try {
        const courseData = await this.getCourseInfo(userMemberCourse.courseId);
        if (courseData) {
          courseInfo = {
            id: userMemberCourse.courseId,
            title: courseData.title,
            description: courseData.description || '',
            level: courseData.level || 'INTERMEDIATE'
          };
        }
      } catch (error) {
        console.error(`Error getting course info for ${userMemberCourse.courseId}:`, error.message);
      }
    }
    
    // If still no courseInfo (user not found in memberCourses), create summary
    if (!courseInfo) {
      const uniqueCourseIds = [...new Set(payment.memberCourses.map(mc => mc.courseId).filter(id => id && id !== 'null'))];
      const courseNames = [];
      
      for (const courseId of uniqueCourseIds) {
        try {
          const courseData = await this.getCourseInfo(courseId);
          if (courseData && courseData.title) {
            courseNames.push(courseData.title);
          }
        } catch (error) {
          console.error(`Error getting course info for ${courseId}:`, error.message);
        }
      }
      
      // Create summary course object for group payments when user not found in members
      courseInfo = {
        id: 'group-courses',
        title: courseNames.length > 0 ? courseNames.join(', ') : 'Multiple Courses',
        description: `Group payment dengan ${payment.totalParticipants || payment.memberCourses.length} peserta`,
        level: 'INTERMEDIATE',
        isGroupSummary: true
      };
      finalCourseId = 'group-courses';
    }
  } else if (finalCourseId && finalCourseId !== '00000000-0000-0000-0000-000000000000' && finalCourseId !== 'null') {
    // If payment has a valid courseId, get course info from course-service
    try {
      // Fetch course directly from course service
      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = this.generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      // console.log(`Making direct API call to course service for ID: ${finalCourseId}`);
      const response = await axios.get(`${courseServiceUrl}/courses/${finalCourseId}`, { headers });
      
      if (response.data && response.data.data) {
        const courseData = response.data.data;
        courseInfo = {
          id: finalCourseId,
          title: courseData.title || `Course ${finalCourseId.substring(0, 8)}`,
          description: courseData.description || '',
          level: courseData.level || null
        };
        console.log(`Retrieved course title: ${courseInfo.title}`);
      } else {
        // Try getting course info from package-service as fallback
        const coursesInPackage = await this.getCoursesInPackage(payment.packageId);
        const matchingCourse = coursesInPackage.find(c => c.id === finalCourseId);
        
        if (matchingCourse) {
          console.log(`Found course info in package: ${matchingCourse.title}`);
          courseInfo = {
            id: finalCourseId,
            title: matchingCourse.title,
            description: matchingCourse.description || '',
            level: matchingCourse.level || null
          };
        } else {
          courseInfo = {
            id: finalCourseId,
            title: `Course ${finalCourseId.substring(0, 8)}`,
            description: '',
            level: 'UNKNOWN'
          };
        }
      }
    } catch (error) {
      console.error(`Error fetching course details for ${finalCourseId}: ${error.message}`);
      courseInfo = {
        id: finalCourseId,
        title: `Course ${finalCourseId.substring(0, 8)}`,
        description: '',
        level: 'UNKNOWN'
      };
    }
  }

  // For bundle packages, get all courses in the bundle
  if (payment.packageType === 'BUNDLE') {
    // Get courses from the package-service
    allCoursesInPackage = await this.getCoursesInPackage(payment.packageId);
  }

  // FALLBACK: Jika courseInfo masih null, buat default course object
  if (!courseInfo) {
    if (payment.packageType === 'BUNDLE') {
      courseInfo = {
        id: '00000000-0000-0000-0000-000000000000',
        title: payment.packageName || 'Bundle Package',
        description: 'Bundle package with multiple courses',
        level: 'BUNDLE'
      };
      finalCourseId = '00000000-0000-0000-0000-000000000000';
    } else {
      courseInfo = {
        id: finalCourseId || 'unknown-course',
        title: payment.courseName || payment.packageName || 'Unknown Course',
        description: 'Course information not available',
        level: payment.packageType || 'UNKNOWN'
      };
      finalCourseId = finalCourseId || 'unknown-course';
    }
  }

  // Check enrollment status
  const enrollmentStatus = await this.checkEnrollmentStatus(payment.id);

  // PERBAIKAN: Get user info for the requesting user
  // console.log(`🔍 Getting user info for requesting user: ${requestingUserId}`);
  const userInfo = await this.getUserInfo(requestingUserId);
  
  if (!userInfo) {
    console.error(`❌ Failed to get user info for user: ${requestingUserId}`);
  } else {
    console.log(`✅ Successfully got user info for ${userInfo.name} (${userInfo.email})`);
  }

  // PERBAIKAN: Pastikan user object selalu ada dengan semua property yang diperlukan
  const userObject = userInfo ? {
    id: userInfo.id || requestingUserId,
    name: userInfo.name || 'Unknown User',
    email: userInfo.email || 'unknown@example.com',
    phone: userInfo.phone || null,
    type: userInfo.type || 'UNKNOWN'
  } : { 
    id: requestingUserId,
    name: 'Unknown User', 
    email: 'unknown@example.com', 
    phone: null,
    type: 'UNKNOWN' 
  };

  // PERBAIKAN: Pastikan finalCourseId tidak pernah null dalam response
  if (!finalCourseId || finalCourseId === 'null' || finalCourseId === 'undefined') {
    if (payment.packageType === 'BUNDLE') {
      finalCourseId = '00000000-0000-0000-0000-000000000000';
    } else if (payment.isGroupPayment) {
      finalCourseId = 'group-courses';
    } else {
      finalCourseId = 'unknown-course';
    }
    console.warn(`⚠️ Setting fallback courseId for payment ${payment.id}: ${finalCourseId}`);
  }

  // Format detailed payment with unified structure
  return {
    id: payment.id,
    userId: payment.userId,
    packageId: payment.packageId,
    courseId: finalCourseId, // NEVER NULL - always has a valid value, specific to requesting user for group payments
    type: payment.type,
    proofLink: payment.proofLink,
    status: payment.status,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    packageName: payment.packageName,
    packageType: payment.packageType,
    price: payment.price,
    courseName: courseInfo?.title || payment.courseName || 'Unknown Course',
    user: userObject, // SEKARANG SELALU ADA VALUE dengan data user yang benar
    course: courseInfo, // SEKARANG SELALU ADA VALUE (tidak null)
    bundleCourses: payment.packageType === 'BUNDLE' ? allCoursesInPackage : undefined, // Only for bundles
    enrollmentStatus: enrollmentStatus.enrolled,
    paymentDate: payment.createdAt,
    
    // TAMBAHAN: Group payment info untuk detailed view
    ...(payment.isGroupPayment && {
      groupPaymentDetails: {
        isGroupPayment: true,
        totalMembers: payment.totalParticipants || (payment.memberCourses?.length || 0),
        groupStatus: payment.groupStatus || 'PENDING',
        allMemberCourses: payment.memberCourses || [],
        creatorInfo: payment.memberCourses?.find(mc => mc.userId === payment.userId) || null
      }
    })
  };
}

  // ============== GROUP PAYMENT METHODS ==============

  /**
   * Check if user already has INTERMEDIATE enrollment
   * @param {string} userId - User ID to check
   * @returns {Promise<Object>} Enrollment status
   */
  static async checkExistingIntermediateEnrollment(userId) {
    try {
      // Get all approved payments for this user
      const userPayments = await prisma.payment.findMany({
        where: {
          userId,
          status: 'APPROVED'
        },
        select: {
          id: true,
          packageId: true,
          courseId: true
        }
      });

      // Check each payment's package type
      for (const payment of userPayments) {
        const packageInfo = await this.getPackageInfo(payment.packageId);
        
        if (packageInfo && packageInfo.type === 'INTERMEDIATE') {
          // Get course name for better error message
          let courseName = 'Unknown Course';
          
          if (payment.courseId && payment.courseId !== '00000000-0000-0000-0000-000000000000') {
            const courseInfo = await this.getCourseInfo(payment.courseId);
            courseName = courseInfo ? courseInfo.title : 'Unknown Course';
          }
          
          return {
            hasEnrollment: true,
            courseName,
            paymentId: payment.id,
            packageInfo
          };
        }
      }

      return { hasEnrollment: false };
    } catch (error) {
      console.error('Error checking existing intermediate enrollment:', error.message);
      return { hasEnrollment: false };
    }
  }

  /**
   * Validate invite emails dengan auth service
   * @param {Array} emails - Array of email addresses to validate
   * @returns {Promise<Object>} Validation results
   */
  static async validateInviteEmails(emails) {
    try {
      const results = {
        validEmails: [],
        invalidEmails: [],
        existingUsers: [],
        nonExistingEmails: [],
        usersWithIntermediateEnrollment: []
      };

      // Check each email with auth service
      for (const email of emails) {
        try {
          const userExists = await this.checkUserByEmail(email);
          
          if (userExists) {
            // Check if user already has INTERMEDIATE enrollment
            const intermediateEnrollment = await this.checkExistingIntermediateEnrollment(userExists.id);
            
            if (intermediateEnrollment.hasEnrollment) {
              results.invalidEmails.push(email);
              results.usersWithIntermediateEnrollment.push({
                email,
                userId: userExists.id,
                name: userExists.name,
                courseName: intermediateEnrollment.courseName
              });
            } else {
              results.validEmails.push(email);
              results.existingUsers.push({
                email,
                userId: userExists.id,
                name: userExists.name,
                type: userExists.type
              });
            }
          } else {
            results.invalidEmails.push(email);
            results.nonExistingEmails.push(email);
          }
        } catch (error) {
          results.invalidEmails.push(email);
          results.nonExistingEmails.push(email);
        }
      }

      return results;
    } catch (error) {
      throw new Error('Gagal validasi email: ' + error.message);
    }
  }

  /**
   * Check user by email via auth service
   * @param {string} email - Email address to check
   * @returns {Promise<Object|null>} User data if exists, null otherwise
   */
  static async checkUserByEmail(email) {
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001';
      const serviceToken = this.generateServiceToken();
      
      const response = await axios.get(`${authServiceUrl}/users/by-email/${email}`, {
        headers: { 'Authorization': `Bearer ${serviceToken}` }
      });
      
      return response.data?.data || null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // User not found
      }
      throw error;
    }
  }

  /**
   * Create group payment dengan member-specific courses - APPROACH 2
   * @param {Object} data - Group payment data
   * @returns {Promise<Object>} Created group payment
   */
  static async createGroupPayment(data) {
    const { creatorId, packageId, creatorCourseId, members, proofLink } = data;
    
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Validate creator's course
        const creatorCourseValidation = await this.validateCourseInPackage(packageId, creatorCourseId);
        if (!creatorCourseValidation) {
          throw new Error('Course yang dipilih creator tidak tersedia dalam package ini');
        }

        // 2. Validate and process invited members
        const memberValidation = {
          validMembers: [],
          invalidMembers: [],
          courseValidationErrors: []
        };

        for (const member of members) {
          try {
            // Check if user exists
            const userExists = await this.checkUserByEmail(member.email);
            if (!userExists) {
              memberValidation.invalidMembers.push({
                email: member.email,
                error: 'User tidak ditemukan'
              });
              continue;
            }

            // Check if user already has INTERMEDIATE enrollment
            const existingEnrollment = await this.checkExistingIntermediateEnrollment(userExists.id);
            if (existingEnrollment.hasEnrollment) {
              memberValidation.invalidMembers.push({
                email: member.email,
                error: `Sudah terdaftar di: ${existingEnrollment.courseName}`
              });
              continue;
            }

            // Validate member's course choice
            const courseValidation = await this.validateCourseInPackage(packageId, member.courseId);
            if (!courseValidation) {
              memberValidation.courseValidationErrors.push({
                email: member.email,
                courseId: member.courseId,
                error: 'Course tidak tersedia dalam package'
              });
              continue;
            }

            // All validations passed
            memberValidation.validMembers.push({
              email: member.email,
              courseId: member.courseId,
              userId: userExists.id,
              name: userExists.name,
              type: userExists.type
            });

          } catch (error) {
            memberValidation.invalidMembers.push({
              email: member.email,
              error: error.message
            });
          }
        }

        // 3. Check validation results
        if (memberValidation.validMembers.length === 0) {
          throw new Error('Tidak ada member yang valid untuk diundang');
        }

        if (memberValidation.invalidMembers.length > 0) {
          const errorMessages = memberValidation.invalidMembers
            .map(m => `${m.email}: ${m.error}`)
            .join(', ');
          throw new Error(`Member tidak valid: ${errorMessages}`);
        }

        if (memberValidation.courseValidationErrors.length > 0) {
          const errorMessages = memberValidation.courseValidationErrors
            .map(m => `${m.email} memilih course yang tidak tersedia`)
            .join(', ');
          throw new Error(`Course validation error: ${errorMessages}`);
        }

        // 4. Check creator doesn't have existing enrollment
        const creatorExistingEnrollment = await this.checkExistingIntermediateEnrollment(creatorId);
        if (creatorExistingEnrollment.hasEnrollment) {
          throw new Error(`Anda sudah terdaftar di: ${creatorExistingEnrollment.courseName}`);
        }

        // 5. Get package info for pricing
        const packageInfo = await this.getPackageInfo(packageId);
        if (!packageInfo || packageInfo.type !== 'INTERMEDIATE') {
          throw new Error('Package tidak valid untuk group payment');
        }

        // 6. Calculate pricing
        const discountedPrice = 81000; // Fixed discount per person
        const totalParticipants = memberValidation.validMembers.length + 1; // +1 for creator
        const totalAmount = discountedPrice * totalParticipants;

        // 7. Validate course availability for creator
        const courseAvailability = await this.validateCourseAvailability(creatorCourseId, 'INTERMEDIATE');
        if (!courseAvailability.valid) {
          throw new Error(`Creator course validation failed: ${courseAvailability.message}`);
        }

        // 8. Create group payment dengan member courses (including course names)
        // First, get all course names
        const allMembersCourses = [];
        
        // Add creator course
        const creatorCourseInfo = await this.getCourseInfo(creatorCourseId);
        allMembersCourses.push({ 
          userId: creatorId, 
          courseId: creatorCourseId, 
          courseName: creatorCourseInfo?.title || 'Unknown Course'
        });
        
        // Add member courses
        for (const member of memberValidation.validMembers) {
          const memberCourseInfo = await this.getCourseInfo(member.courseId);
          allMembersCourses.push({ 
            userId: member.userId, 
            courseId: member.courseId, 
            courseName: memberCourseInfo?.title || 'Unknown Course'
          });
        }

        const groupPayment = await tx.payment.create({
          data: {
            userId: creatorId,
            packageId,
            courseId: null, // No single course for group payment with different courses
            type: 'UMUM',
            proofLink,
            status: 'PAID',
            isGroupPayment: true,
            inviteEmails: memberValidation.validMembers.map(m => m.email),
            invitedUserIds: memberValidation.validMembers.map(m => m.userId),
            groupStatus: 'PENDING',
            originalAmount: packageInfo.price * totalParticipants,
            discountedAmount: totalAmount,
            totalParticipants,
            // PERBAIKAN: Store member course choices WITH course names
            memberCourses: allMembersCourses // JSON field with courseName included
          }
        });

        // 9. Send payment confirmation emails to all group members
        try {
          const allUserIds = [creatorId, ...memberValidation.validMembers.map(m => m.userId)];
          await this.sendGroupPaymentEmails(groupPayment, allUserIds, packageInfo);
          console.log('Group payment confirmation emails sent successfully');
        } catch (emailError) {
          console.error('Failed to send group payment emails:', emailError);
          // Continue anyway since payment creation was successful
        }

        // 10. Prepare response data (course names already included in allMembersCourses)
        return {
          ...groupPayment,
          creator: await this.getUserInfo(creatorId),
          members: [
            { 
              ...(await this.getUserInfo(creatorId)), 
              role: 'creator',
              courseId: creatorCourseId,
              courseName: allMembersCourses.find(c => c.userId === creatorId)?.courseName
            },
            ...memberValidation.validMembers.map(m => ({ 
              ...m, 
              role: 'member',
              courseName: allMembersCourses.find(c => c.userId === m.userId)?.courseName
            }))
          ],
          memberCourses: allMembersCourses, // Already includes courseName
          totalMembers: totalParticipants
        };
      });
    } catch (error) {
      throw new Error('Gagal membuat group payment: ' + error.message);
    }
  }

  /**
   * Get all group payments
   * @returns {Promise<Array>} List of group payments
   */
  static async getGroupPayments() {
    try {
      const groupPayments = await prisma.payment.findMany({
        where: { isGroupPayment: true },
        orderBy: [
          { groupStatus: 'asc' }, // PENDING first
          { createdAt: 'desc' }
        ]
      });
    // Enhance with user info
    const enhanced = await Promise.all(
      groupPayments.map(async (payment) => {
        const creator = await this.getUserInfo(payment.userId);
        
        // Get course name instead of full package info
        const courseInfo = await this.getCourseInfo(payment.courseId);
        const courseName = courseInfo?.title || 'Unknown Course';
        
        // Get invited users info
        const invitedUsers = [];
        if (payment.invitedUserIds && Array.isArray(payment.invitedUserIds)) {
          for (const userId of payment.invitedUserIds) {
            try {
              const userInfo = await this.getUserInfo(userId);
              invitedUsers.push(userInfo);
            } catch (error) {
              console.error(`Error getting user info for ${userId}:`, error.message);
            }
          }
        }

        // Get ALL members (creator + invited users)
        const allMembers = [
          { ...creator, role: 'creator' },
          ...invitedUsers.map(user => ({ ...user, role: 'member' }))
        ].filter(Boolean);

        return {
          ...payment,
          creator,
          members: allMembers, // All members without hierarchy
          courseName,
          inviteEmails: payment.inviteEmails || [],
          totalMembers: allMembers.length
        };
      })
    );

      return enhanced;
    } catch (error) {
      throw new Error('Gagal mengambil group payments: ' + error.message);
    }
  }

  /**
   * Get group payment by ID - UPDATED untuk show member courses
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Group payment details
   */
  static async getGroupPaymentById(paymentId) {
    try {
      const groupPayment = await prisma.payment.findUnique({
        where: { 
          id: paymentId,
          isGroupPayment: true 
        }
      });

      if (!groupPayment) {
        throw new Error('Group payment tidak ditemukan');
      }

      // Enhance with user info dan course info per member
      const creator = await this.getUserInfo(groupPayment.userId);
      const memberCourses = groupPayment.memberCourses || [];
      
      // Get detailed member info with their course choices
      const membersWithCourses = await Promise.all(
        memberCourses.map(async (mc) => {
          try {
            const userInfo = await this.getUserInfo(mc.userId);
            const courseInfo = await this.getCourseInfo(mc.courseId);
            
            return {
              ...userInfo,
              role: mc.userId === groupPayment.userId ? 'creator' : 'member',
              courseChoice: {
                courseId: mc.courseId,
                courseName: courseInfo?.title || 'Unknown Course'
              }
            };
          } catch (error) {
            console.error(`Error getting info for user ${mc.userId}:`, error.message);
            return null;
          }
        })
      );

      const validMembers = membersWithCourses.filter(Boolean);

      return {
        ...groupPayment,
        creator,
        members: validMembers,
        memberCourses: memberCourses,
        totalMembers: validMembers.length
      };
    } catch (error) {
      throw new Error('Gagal mengambil group payment: ' + error.message);
    }
  }

  /**
   * Approve group payment and create enrollments for all participants - UPDATED FOR DIFFERENT COURSES
   * @param {string} paymentId - Payment ID to approve
   * @returns {Promise<Object>} Approval result
   */
  static async approveGroupPayment(paymentId) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Get group payment
        const groupPayment = await tx.payment.findUnique({
          where: { id: paymentId }
        });

        if (!groupPayment || !groupPayment.isGroupPayment) {
          throw new Error('Group payment tidak ditemukan');
        }

        if (groupPayment.groupStatus === 'APPROVED') {
          throw new Error('Group payment sudah diapprove');
        }

        // console.log('=== GROUP PAYMENT APPROVAL (DIFFERENT COURSES) ===');
        // console.log('Payment ID:', groupPayment.id);
        // console.log('Member Courses:', groupPayment.memberCourses);

        // Update payment status
        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: { 
            status: 'APPROVED',
            groupStatus: 'APPROVED'
          }
        });

        // Create enrollments based on memberCourses (each member gets their chosen course)
        const memberCourses = groupPayment.memberCourses || [];
        
        if (memberCourses.length === 0) {
          throw new Error('No member course data found');
        }

        console.log(`📝 Creating enrollments for ${memberCourses.length} members with their chosen courses`);
        
        const enrollments = [];
        for (const memberCourse of memberCourses) {
          try {
            const enrollment = await tx.enrollment.create({
              data: {
                userId: memberCourse.userId,
                courseId: memberCourse.courseId, // Each member gets their chosen course
                paymentId: groupPayment.id,
                packageId: groupPayment.packageId,
                status: 'ENROLLED'
              }
            });
            enrollments.push(enrollment);
            console.log(`✅ Created enrollment for user ${memberCourse.userId} in course ${memberCourse.courseId}:`, enrollment.id);
          } catch (enrollmentError) {
            console.error(`❌ Failed to create enrollment for user ${memberCourse.userId}:`, enrollmentError);
            throw new Error(`Failed to create enrollment for user ${memberCourse.userId}: ${enrollmentError.message}`);
          }
        }

        console.log(`🎉 Successfully created ${enrollments.length} enrollments`);

        // Clear cache for ALL courses involved
        try {
          const { invalidateCache } = await import('../utils/cache-helper.js');
          
          // Get unique course IDs from memberCourses
          const uniqueCourseIds = [...new Set(memberCourses.map(mc => mc.courseId))];
          
          // Clear cache for each course
          for (const courseId of uniqueCourseIds) {
            invalidateCache('enrollment', courseId);
            console.log(`🔄 Cache cleared for course: ${courseId}`);
          }
          
          // Clear all-enrollments cache
          invalidateCache('all-enrollments', 'all-enrollments');
          
          console.log('🔄 All enrollment caches cleared after group payment approval');
        } catch (cacheError) {
          console.error('❌ Error clearing cache:', cacheError.message);
        }

        // Send notification emails to all members
        try {
          await this.sendGroupEnrollmentEmails(groupPayment, memberCourses);
          console.log('📧 Group enrollment emails sent successfully');
        } catch (emailError) {
          console.error('❌ Failed to send group enrollment emails:', emailError);
        }

        return {
          payment: updatedPayment,
          enrollments,
          totalEnrolled: enrollments.length,
          memberIds: memberCourses.map(mc => mc.userId),

          courseEnrollments: memberCourses.map(mc => ({
            userId: mc.userId,
            courseId: mc.courseId
          }))
        };
      });
    } catch (error) {
      console.error('❌ Error in approveGroupPayment:', error);
      throw new Error('Gagal approve group payment: ' + error.message);
    }
  }

  /**
   * Delete group payment (admin only)
   * @param {string} paymentId - Payment ID to delete
   * @returns {Promise<Object>} Deletion result
   */
  static async deleteGroupPayment(paymentId) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Get group payment
        const groupPayment = await tx.payment.findUnique({
          where: { id: paymentId }
        });

        if (!groupPayment || !groupPayment.isGroupPayment) {
          throw new Error('Group payment tidak ditemukan');
        }

        if (groupPayment.groupStatus === 'APPROVED') {
          throw new Error('Tidak dapat menghapus group payment yang sudah diapprove');
        }

        // Delete related enrollments first (if any)
        await tx.enrollment.deleteMany({
          where: { paymentId }
        });

        // Delete the payment
        await tx.payment.delete({
          where: { id: paymentId }
        });

        return {
          message: 'Group payment berhasil dihapus',
          deletedPaymentId: paymentId
        };
      });
    } catch (error) {
      throw new Error('Gagal menghapus group payment: ' + error.message);
    }
  }

  /**
   * Send payment confirmation emails to all group members
   * @param {Object} groupPayment - Group payment data
   * @param {Array} userIds - Array of user IDs (creator + invited users)
   * @param {Object} packageInfo - Package information
   */
  static async sendGroupPaymentEmails(groupPayment, userIds, packageInfo) {
    try {
      const { sendPaymentConfirmationEmail } = await import('../utils/email-helper.js');
      
      for (const userId of userIds) {
        try {
          const userInfo = await this.getUserInfo(userId);
          
          if (userInfo && userInfo.email) {
            // Create payment object for email with proper group payment data
            const paymentForEmail = {
              id: groupPayment.id,
              amount: 81000, // Fixed amount per person for group payment
              createdAt: groupPayment.createdAt,
              courseId: groupPayment.courseId,
              // IMPORTANT: Mark as group payment dan provide member courses
              isGroupPayment: true,
              memberCourses: groupPayment.memberCourses || [],
              userId: userId  // Ensure the email helper knows which user this email is for
            };
            
            await sendPaymentConfirmationEmail(paymentForEmail, userInfo, packageInfo);
            console.log(`Payment confirmation email sent to member: ${userInfo.email}`);
          }
        } catch (error) {
          console.error(`Error sending payment email to member ${userId}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error sending group payment emails:', error);
      throw error;
    }
  }

  /**
   * Send enrollment emails to all group members
   * @param {Object} groupPayment - Group payment data
   * @param {Array} memberCourses - Array of {userId, courseId, email} objects
   */
  static async sendGroupEnrollmentEmails(groupPayment, memberCourses) {
    try {
      const { sendEnrollmentConfirmationEmail } = await import('../utils/email-helper.js');
      
      for (const memberCourse of memberCourses) {
        try {
          const userInfo = await this.getUserInfo(memberCourse.userId);
          const packageInfo = await this.getPackageInfo(groupPayment.packageId);
          
          // Get course name for the specific course this member is enrolled in
          let courseNames = null;
          if (memberCourse.courseId) {
            try {
              const courseInfo = await this.getCourseInfo(memberCourse.courseId);
              courseNames = courseInfo ? [courseInfo.title] : null;
            } catch (error) {
              console.error('Error getting course info for enrollment email:', error.message);
            }
          }
          
          if (userInfo && userInfo.email) {
            // Create payment object for enrollment email with member's specific course
            const paymentForEmail = {
              id: groupPayment.id,
              courseId: memberCourse.courseId, // Use member's specific course
              packageId: groupPayment.packageId
            };
            
            await sendEnrollmentConfirmationEmail(paymentForEmail, userInfo, packageInfo, courseNames);
            console.log(`Enrollment confirmation email sent to member: ${userInfo.email} for course: ${memberCourse.courseId}`);
          }
        } catch (error) {
          console.error(`Error sending enrollment email to member ${memberCourse.userId}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error sending group enrollment emails:', error);
      throw error;
    }
  }

  /**
   * Validate member emails dan course choices secara bersamaan
   * @param {Array} members - Array of {email, courseId} objects
   * @returns {Promise<Object>} Validation results dengan course info
   */
  static async validateMemberEmailsAndCourses(members) {
    try {
      const results = {
        validMembers: [],
        invalidMembers: [],
        usersWithIntermediateEnrollment: [],
        courseValidationErrors: []
      };

      for (const member of members) {
        try {
          // Check if user exists by email
          const userExists = await this.checkUserByEmail(member.email);
          
          if (!userExists) {
            results.invalidMembers.push({
              email: member.email,
              courseId: member.courseId,
              error: 'User tidak ditemukan'
            });
            continue;
          }

          // Check if user already has INTERMEDIATE enrollment
          const intermediateEnrollment = await this.checkExistingIntermediateEnrollment(userExists.id);
          
          if (intermediateEnrollment.hasEnrollment) {
            results.usersWithIntermediateEnrollment.push({
              email: member.email,
              courseId: member.courseId,
              courseName: intermediateEnrollment.courseName,
              error: `Sudah terdaftar di: ${intermediateEnrollment.courseName}`
            });
            continue;
          }

          // Validate course choice (akan divalidasi lebih lanjut di createGroupPayment)
          // Untuk sekarang, asumsikan course valid jika ada courseId
          if (!member.courseId) {
            results.courseValidationErrors.push({
              email: member.email,
              error: 'Course ID harus diisi'
            });
            continue;
          }

          // All validations passed
          results.validMembers.push({
            email: member.email,
            courseId: member.courseId,
            userId: userExists.id,
            name: userExists.name,
            type: userExists.type
          });

        } catch (error) {
          results.invalidMembers.push({
            email: member.email,
            courseId: member.courseId,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error('Gagal validasi members: ' + error.message);
    }
  }
}
