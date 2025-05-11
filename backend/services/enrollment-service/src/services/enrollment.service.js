import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/rbac/index.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
const prisma = new PrismaClient();

/**
 * Enrollment Service
 * Handles business logic for enrollment operations
 */
class EnrollmentService {
  /**
   * Enroll a user to multiple courses (typically from a bundle)
   * @param {string} userId - The ID of the user to enroll
   * @param {string} packageId - The optional ID of the package/bundle
   * @param {string[]} courseIds - Array of course IDs to enroll the user in
   * @returns {Promise<Array>} - Array of created/updated enrollments
   */
  async enrollUserToCourses(userId, packageId, courseIds) {
    const enrollments = [];    for (const courseId of courseIds) {
      try {
        const enrollment = await prisma.enrollment.upsert({
          where: { 
            userId_courseId: { 
              userId, 
              courseId 
            } 
          },
          update: {}, // If it exists, we don't need to update anything
          create: { 
            userId, 
            courseId, 
            packageId 
          },
        });
        
        enrollments.push(enrollment);
      } catch (error) {
        console.error(`Error enrolling user ${userId} in course ${courseId}:`, error);
        // Continue with other enrollments even if one fails
      }
    }    // NOTE: We're no longer sending enrollment confirmation emails from here
    // The email will only be sent from the payment-service to avoid duplicates

    return enrollments;
  }

  /**
   * Get all enrollments for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} - Array of enrollment records with course details
   */  async getUserEnrollments(userId) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId
      }
    });

    return enrollments.map(enrollment => ({
      id: enrollment.id,
      courseId: enrollment.courseId,
      packageId: enrollment.packageId,
      createdAt: enrollment.createdAt,
      isEnrolled: true // Always true since these are enrolled courses
    }));
  }

  /**
   * Check if a user is enrolled in a specific course
   * @param {string} userId - The ID of the user
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Object>} - Object with isEnrolled flag
   */
  async checkEnrollmentStatus(userId, courseId) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    return {
      isEnrolled: !!enrollment
    };
  }

  /**
   * Get all users enrolled in a specific course (for admin)
   * @param {string} courseId - The ID of the course
   * @returns {Promise<Array>} - Array of enrollment records with user details
   */  
  async getCourseEnrollments(courseId) {
    return prisma.enrollment.findMany({
      where: {
        courseId: courseId
      }
    });
  }

  /**
   * Get all enrollments (for admin)
   * @returns {Promise<Array>} - Array of all enrollment records
   */
  async getAllEnrollments() {
    return prisma.enrollment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

    async isUserEnrolled(userId, courseId) {
    const enrollment = await prisma.enrollment.count({
      where:{
        userId
      }
    });

    return enrollment > 0;
  }

  /**
   * Send an enrollment confirmation email
   * @param {string} userId - The ID of the enrolled user
   * @param {string} packageId - The package ID (if applicable)
   * @param {string[]} courseIds - Array of enrolled course IDs
   * @returns {Promise<void>}
   */
async sendEnrollmentConfirmationEmail(userId, packageId, courseIds) {
  try {
    // Get user details from auth service
    const userInfo = await this.getUserInfo(userId);
    if (!userInfo || !userInfo.email) {
      console.error(`Failed to get user info for user ID: ${userId}`);
      return;
    }

    // Get course information for the first course (if multiple)
    const courseId = courseIds[0]; // Just use the first course for the email
    const courseInfo = await this.getCourseInfo(courseId);
    
    if (!courseInfo) {
      console.error(`Failed to get course info for course ID: ${courseId}`);
      return;
    }

    const emailServiceUrl = process.env.EMAIL_SERVICE_URL || 'http://email-service-api:8008';
    const serviceApiKey = process.env.SERVICE_API_KEY || 'default-api-key';
    
  // Map course titles to their specific date ranges
    const courseScheduleMap = {
      // INTERMEDIATE courses
      'UI/UX': '17–28 Juli 2025',
      'Software Engineering': '16–26 Juli 2025',
      'Data Science & Artificial Intelligence': '14–28 Juli 2025',
      'Cyber Security': '16–27 Juli 2025',
      
      // ENTRY courses
      'Web Development Fundamentals': '30 Juni–11 Juli 2025',
      'Graphic Design': '30 Juni–11 Juli 2025',
      'Game Development': '30 Juni–11 Juli 2025',
      'Fundamental Cyber Security': '30 Juni–15 Juli 2025',
      'Competitive Programming': '30 Juni–13 Juli 2025',
      'Basic Python': '30 Juni–21 Juli 2025'
    };
    
    // Get custom date based on course title or use default formatting
    let startDate;
    const courseTitle = courseInfo.title;
    
    if (courseScheduleMap[courseTitle]) {
      startDate = courseScheduleMap[courseTitle];
    } else {
      // Fallback to the original date formatting
      startDate = courseInfo.startDate 
        ? new Date(courseInfo.startDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Sekarang';
    }
    
    // Create course access link
    const courseLink = `${process.env.FRONTEND_URL || 'https://academy.omahti.web.id'}/courses/${courseId}`;
    
    // Send the enrollment confirmation email
    await axios.post(`${emailServiceUrl}/email/enrollment-confirmation`, {
      email: userInfo.email,
      username: userInfo.name || userInfo.email.split('@')[0],
      courseName: courseInfo.title || 'OmahTI Academy Course',
      startDate: startDate,
      courseLink: courseLink
    }, {
      headers: {
        'x-api-key': serviceApiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.info(`Enrollment confirmation email sent to: ${userInfo.email}`);
  } catch (error) {
    console.error('Error sending enrollment confirmation email:', error);
    throw error;
  }
}

  /**
   * Get user information from the auth service
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User information
   */  async getUserInfo(userId) {
    try {
      // Use the proper config settings
      const authServiceUrl = config.services.auth;
      console.log(`Using auth service URL: ${authServiceUrl}`);
      
      // Generate service-to-service JWT token
      const serviceToken = this.generateServiceToken();
      
      const response = await axios.get(`${authServiceUrl}/users/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${serviceToken}`,
          'x-service-api-key': process.env.SERVICE_API_KEY || 'default-key'
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error(`Failed to get user info: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data:`, error.response.data);
      } else if (error.request) {
        console.error(`No response received. Request:`, error.request);
      }
      return null;
    }
  }
  /**
   * Get course information from the course service
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} Course information
   */
  async getCourseInfo(courseId) {
    try {
      const courseServiceUrl = config.services.course;
      console.log(`Using course service URL: ${courseServiceUrl}`);
      
      // Generate service-to-service JWT token
      const serviceToken = this.generateServiceToken();
      
      const response = await axios.get(`${courseServiceUrl}/courses/${courseId}`, {
        headers: { 
          'Authorization': `Bearer ${serviceToken}`,
          'x-service-api-key': process.env.SERVICE_API_KEY || 'default-key'
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error(`Failed to get course info: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data:`, error.response.data);
      }
      return null;
    }
  }
  
  /**
   * Generate a service JWT token for service-to-service communication
   * @returns {string} JWT token
   */
  generateServiceToken() {
    const payload = {
      id: 'enrollment-service',
      role: 'SERVICE'
    };
    
    return jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
  }
}

export default new EnrollmentService();
