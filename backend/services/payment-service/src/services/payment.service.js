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
        // For BEGINNER or INTERMEDIATE packages
        courses = responseData.courses.map(course => ({
          id: course.courseId,
          title: course.courseTitle || course.title || 'Untitled Course'
        }));
      } else if (responseData.bundlePairs) {
        // For BUNDLE packages
        responseData.bundlePairs.forEach(pair => {
          if (pair.courses) {
            const mappedCourses = pair.courses.map(course => ({
              id: course.courseId,
              title: course.courseTitle || course.title || 'Untitled Course'
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
}