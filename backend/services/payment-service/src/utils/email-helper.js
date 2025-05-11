/**
 * Email notification helper for payment service
 */
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { retryWithBackoff, executeWithCircuitBreaker } from './retry-helper.js';

// Constants
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://email-service-api:8004';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Generate a service token for inter-service communication
 * @returns {string} JWT token
 */
export const generateServiceToken = () => {
  const payload = {
    id: 'payment-service',
    role: 'SERVICE'
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

/**
 * Send a payment confirmation email
 * @param {Object} payment - Payment details
 * @param {Object} userInfo - User information
 * @param {Object} packageInfo - Package information
 */
export const sendPaymentConfirmationEmail = async (payment, userInfo, packageInfo) => {
  try {
    if (!userInfo || !userInfo.email) {
      console.error('Cannot send email: Missing user information');
      return false;
    }
    
    // Format the amount with Rupiah currency
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(payment.amount || packageInfo.price || 0);

    // Format the date
    const formattedDate = new Date(payment.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Get the actual course name - NEW SECTION
    let courseName = packageInfo.name;
    if (payment.courseId) {
      try {
        // Import CourseService directly to avoid circular dependencies
        const { CourseService } = await import('../services/course.service.js');
        const courseDetails = await CourseService.getCourseById(payment.courseId);
        if (courseDetails?.title) {
          courseName = courseDetails.title;
          console.log(`Using course title "${courseName}" for payment confirmation email`);
        }
      } catch (error) {
        console.error('Error getting course title for email:', error.message);
      }
    }

    // Create token
    const token = generateServiceToken();

    // Send email via circuit breaker pattern
    await executeWithCircuitBreaker('email', async () => {
      return await retryWithBackoff(async () => {
        return await axios.post(
          `${EMAIL_SERVICE_URL}/email/payment-confirmation`,
          {
            email: userInfo.email,
            username: userInfo.name,
            courseName: courseName, 
            amount: formattedAmount,
            transactionId: payment.id,
            date: formattedDate
          },
          {
            headers: {
              'x-api-key': process.env.SERVICE_API_KEY || 'default-key',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000
          }
        );
      });
    });
    
    console.log(`Payment confirmation email sent to: ${userInfo.email} with course name: ${courseName}`);
    return true;
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error.message);
    return false;
  }
};

/**
 * Send an enrollment confirmation email
 * @param {Object} payment - Payment details
 * @param {Object} userInfo - User information
 * @param {Object} packageInfo - Package information
 * @param {Array} courseNames - List of course names (optional)
 */
export const sendEnrollmentConfirmationEmail = async (payment, userInfo, packageInfo, courseNames = null) => {  
  try {
    if (!userInfo || !userInfo.email) {
      console.error('Cannot send enrollment confirmation: Missing user information');
      return false;
    }    // Map course names to their specific date ranges
    const courseScheduleMap = {
      // INTERMEDIATE courses
      'UI/UX': '17–28 Juli 2025',
      'Software Engineering': '16–26 Juli 2025',
      'Data Science & Artificial Intelligence': '14–28 Juli 2025',
      'Cyber Security': '16–27 Juli 2025',
      
      // ENTRY courses
      'Web Development': '30 Juni–11 Juli 2025',
      'Graphic Design': '30 Juni–11 Juli 2025',
      'Game Development': '30 Juni–11 Juli 2025',
      'Fundamental Cyber Security': '30 Juni–15 Juli 2025',
      'Competitive Programming': '30 Juni–13 Juli 2025',
      'Basic Python': '30 Juni–21 Juli 2025'
    };

    // Build course name string
    const courseName = Array.isArray(courseNames) && courseNames.length > 0
      ? courseNames.join(', ')
      : (packageInfo?.name || 'Your course');

    // Determine if this is a bundle (multiple courses)
    const isBundle = Array.isArray(courseNames) && courseNames.length > 1;
    
    // Format the start date
    let startDate;
    
    if (isBundle) {
      // For bundles, show each course with its date
      const courseWithDates = courseNames.map(name => {
        return courseScheduleMap[name] 
          ? `${name}: ${courseScheduleMap[name]}` 
          : name;
      });
      startDate = courseWithDates.join(', ');
    } else {
      // For single course, just show the date
      const singleCourseName = Array.isArray(courseNames) ? courseNames[0] : packageInfo?.name;
      
      if (singleCourseName && courseScheduleMap[singleCourseName]) {
        startDate = courseScheduleMap[singleCourseName];
      } else {
        // Fallback to the original date format
        startDate = packageInfo?.startDate 
          ? new Date(packageInfo.startDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          : new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
      }
    }

    // Generate course link - can be either specific course or learning dashboard
    const courseLink = payment?.courseId 
      ? `${FRONTEND_URL}/courses/${payment.courseId}` 
      : `${FRONTEND_URL}/learning`;

    // Create token
    const token = generateServiceToken();

    // Send email via circuit breaker pattern
    await executeWithCircuitBreaker('email', async () => {
      return await retryWithBackoff(async () => {
        return await axios.post(
          `${EMAIL_SERVICE_URL}/email/enrollment-confirmation`,
          {
            email: userInfo.email,
            username: userInfo.name || 'Student',
            courseName: courseName,
            startDate: startDate,
            courseLink: courseLink
          },
          {
            headers: {
              'x-api-key': process.env.SERVICE_API_KEY || 'default-key',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000
          }
        );
      });
    });
    
    console.log(`Enrollment confirmation email sent to: ${userInfo.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send enrollment confirmation email:', error.message);
    return false;
  }
};
