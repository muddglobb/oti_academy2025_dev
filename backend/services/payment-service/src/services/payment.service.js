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
    endDate
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
      {
        status: 'asc' 
      },
      {
        createdAt: 'desc' 
      }
    ]
  });

  // Enhance payments with package info and price
  const enhancedPayments = await this.enhancePaymentsWithPrice(payments);
  
  return {
    payments: enhancedPayments,
    total: enhancedPayments.length
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
        
        console.log('Cache miss - making request to:', `${packageServiceUrl}/packages/${packageId}`);
        
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
    // Similar to getCourseEnrollmentCount but for 'PAID' status
    const packageTypeCache = new Map();
    const bundleCourseCache = new Map();
    
    // 1. Get direct pending payments for this course
    const directPayments = await prisma.payment.findMany({
      where: {
        courseId,
        status: 'PAID'
      },
      select: {
        id: true,
        packageId: true,
        userId: true 
      }
    });
    
    // 2. Process direct payments
    const uniquePackageIds = [...new Set(directPayments.map(p => p.packageId))];
    let entryIntermediateCount = 0;
    
    // Get package types for direct payments
    await Promise.all(uniquePackageIds.map(async (packageId) => {
      if (!packageTypeCache.has(packageId)) {
        const packageInfo = await this.getPackageInfo(packageId);
        if (packageInfo) {
          packageTypeCache.set(packageId, packageInfo.type);
        }
      }
    }));
    
    // Count non-bundle pending payments
    for (const payment of directPayments) {
      const packageType = packageTypeCache.get(payment.packageId);
      if (packageType && packageType !== 'BUNDLE') {
        entryIntermediateCount++;
      }
    }
    
    // 3. Get bundle pending payments
    const bundlePayments = await prisma.payment.findMany({
      where: {
        status: 'PAID',
        courseId: '00000000-0000-0000-0000-000000000000'
      },
      select: {
        id: true,
        packageId: true,
        userId: true 
      }
    });
    
    // Count pending bundle enrollments
    let bundleCount = 0;
    
    for (const payment of bundlePayments) {
      // Get package type if not already cached
      if (!packageTypeCache.has(payment.packageId)) {
        const packageInfo = await this.getPackageInfo(payment.packageId);
        if (packageInfo) {
          packageTypeCache.set(payment.packageId, packageInfo.type);
        }
      }
    
      const packageType = packageTypeCache.get(payment.packageId);
    
      if (packageType === 'BUNDLE') {
        // Get courses in bundle if not already cached
         if (!bundleCourseCache.has(payment.packageId)) {
          const coursesInBundle = await this.getCoursesInPackage(payment.packageId);
          bundleCourseCache.set(payment.packageId, coursesInBundle || []);
        }
      
        const coursesInBundle = bundleCourseCache.get(payment.packageId);
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
      console.log(`Cache miss - calculating enrollment count for course ${courseId}`);
      
      // In-memory cache for this calculation session
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
          packageId: true,
          userId: true 
        }
      });
      
      // 2. Process direct payments with batch package info retrieval
      const uniquePackageIds = [...new Set(directPayments.map(p => p.packageId))];
      let entryIntermediateCount = 0;
      
      // Batch fetch package info for direct payments
      if (uniquePackageIds.length > 0) {
        // First, try to preload all package info at once
        await batchPreloadPackageInfo(uniquePackageIds, async (packageId) => {
          return await this.getPackageInfo(packageId);
        });
        
        // Get package types from already cached info
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
      
      // 3. Get bundle enrollments more efficiently by using cached data and batching queries
      const bundlePayments = await prisma.payment.findMany({
        where: {
          status: 'APPROVED'
        },
        select: {
          id: true,
          packageId: true,
          userId: true 
        }
      });
      
      // Get unique package IDs from all payments
      const allPackageIds = [...new Set(bundlePayments.map(p => p.packageId))];
      
      // Preload all package info at once
      await batchPreloadPackageInfo(allPackageIds, async (packageId) => {
        return await this.getPackageInfo(packageId);
      });
      
      // Fetch package info for all packages in one batch (using cached data when available)
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
      
      // Batch fetch courses for all bundle packages (will use cache when available)
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
      console.log('Cache miss - calculating enrollment counts for all courses');
      
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
   * Enhance payments with price information from package
   * @param {Array} payments - List of payments
   * @returns {Promise<Array>} Enhanced payments with price info
   */
  static async enhancePaymentsWithPrice(payments) {
    return Promise.all(
      payments.map(async (payment) => {
        // Get package info to get price
        const packageInfo = await this.getPackageInfo(payment.packageId);
        
        // Get course info for direct course enrollment
        let courseName = null;
        if (payment.courseId && payment.courseId !== '00000000-0000-0000-0000-000000000000') {
          // Import CourseService at the point of use to prevent circular dependencies
          const { CourseService } = await import('./course.service.js');
          const courseInfo = await CourseService.getCourseById(payment.courseId);
          if (courseInfo) {
            courseName = courseInfo.title;
          }
        } else if (packageInfo?.type === 'BUNDLE') {
          // For bundle payments, get all courses in the bundle
          const coursesInBundle = await this.getCoursesInPackage(payment.packageId);
          if (coursesInBundle && Array.isArray(coursesInBundle) && coursesInBundle.length > 0) {
            // Create a comma-separated list of course names
            courseName = coursesInBundle.map(course => course.title).join(', ');
          }
        }
        
        // If package info is available, add price to payment
        if (packageInfo) {
          return {
            ...payment,
            packageName: packageInfo.name,
            packageType: packageInfo.type,
            price: packageInfo.price,
            courseName: courseName || 'Unknown Course'
          };
        }
        
        // Return original payment if package info not available
        return {
          ...payment,
          courseName: courseName || 'Unknown Course'
        };
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
        
        console.log('Cache miss - fetching courses for package:', packageId);
        
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
      console.log(`Course not found with ID ${courseId}, trying to find in packages`);
      
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
  }  /**
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
        phone: null,
        type: 'UNKNOWN'
      };
      
      return {
        ...payment,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
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
    const enrollmentStatus = await this.checkEnrollmentStatus(payment.id);    // Format detailed payment
    return {
      ...payment,
      user: userInfo ? {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        type: userInfo.type
      } : { 
        name: 'Unknown User', 
        email: 'unknown@example.com', 
        phone: null,
        type: 'UNKNOWN' 
      },
      course: courseInfo,
      bundleCourses: payment.packageType === 'BUNDLE' ? allCoursesInPackage : null,
      enrollmentStatus: enrollmentStatus.enrolled,
      paymentDate: payment.createdAt
    };
  }
}
