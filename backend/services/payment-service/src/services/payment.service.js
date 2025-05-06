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
    
    return {
      payments,
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
    return prisma.payment.findUnique({
      where: { id }
    });
  }
  
  /**
   * Get payments by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User's payments
   */
  static async getPaymentsByUserId(userId) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
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
    return prisma.payment.update({
      where: { id },
      data: { status: 'APPROVED' }
    });
  }
  
  /**
   * Request back payment
   * @param {string} id - Payment ID
   * @param {Object} backData - Back payment data
   * @returns {Promise<Object>} Updated payment
   */
  static async requestBack(id, backData) {
    return prisma.payment.update({
      where: { id },
      data: {
        backStatus: 'REQUESTED',
        ...backData
      }
    });
  }
  
  /**
   * Complete back payment
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Updated payment
   */
  static async completeBack(id) {
    return prisma.payment.update({
      where: { id },
      data: {
        backStatus: 'COMPLETED',
        backCompletedAt: new Date()
      }
    });
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
}