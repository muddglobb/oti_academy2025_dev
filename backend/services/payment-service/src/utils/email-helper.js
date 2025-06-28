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

    // PERBAIKAN: Get the actual course name - Handle group payments
    let courseName = packageInfo.name; // Default fallback
    
    // Log payment details for debugging
    console.log(`📧 Payment confirmation - Payment ID: ${payment.id}, User: ${userInfo.id}, IsGroupPayment: ${payment.isGroupPayment || false}`);
    console.log(`📧 Payment courseId: ${payment.courseId}, Package: ${packageInfo.name}`);
    
    try {
      // PERBAIKAN: Handle group payments first
      if (payment.isGroupPayment && payment.memberCourses && Array.isArray(payment.memberCourses)) {
        console.log(`📧 Group payment detected - looking for course for user ${userInfo.id}`);
        
        // For group payments, find the specific course for this user
        const userMemberCourse = payment.memberCourses.find(mc => mc.userId === userInfo.id);
        
        if (userMemberCourse && userMemberCourse.courseName) {
          // Use the course name directly from memberCourses
          courseName = userMemberCourse.courseName;
          console.log(`📧 Found user's course in group payment: ${courseName}`);
        } else if (userMemberCourse && userMemberCourse.courseId) {
          // If courseName not available, try to fetch from course service
          try {
            const { PaymentService } = await import('../services/payment.service.js');
            const courseInfo = await PaymentService.getCourseInfo(userMemberCourse.courseId);
            if (courseInfo && courseInfo.title) {
              courseName = courseInfo.title;
              console.log(`📧 Fetched course title for group payment: ${courseName}`);
            }
          } catch (courseError) {
            console.error(`❌ Error fetching course info for group payment: ${courseError.message}`);
          }
        } else {
          console.warn(`⚠️ User ${userInfo.id} not found in memberCourses for group payment ${payment.id}`);
          // Fallback: use the first available course name from memberCourses
          const firstMemberCourse = payment.memberCourses.find(mc => mc.courseName);
          if (firstMemberCourse) {
            courseName = firstMemberCourse.courseName;
            console.log(`📧 Using first available course name for group payment: ${courseName}`);
          }
        }
      } 
      // PERBAIKAN: Handle individual payments
      else if (payment.courseId && payment.courseId !== '00000000-0000-0000-0000-000000000000') {
        console.log(`📧 Individual payment detected - fetching course info for ${payment.courseId}`);
        
        // Import CourseService directly to avoid circular dependencies
        const { CourseService } = await import('../services/course.service.js');
        const courseDetails = await CourseService.getCourseById(payment.courseId);
        if (courseDetails?.title) {
          courseName = courseDetails.title;
          console.log(`📧 Using course title "${courseName}" for individual payment confirmation email`);
        } else {
          // Fallback: try PaymentService
          const { PaymentService } = await import('../services/payment.service.js');
          const courseInfo = await PaymentService.getCourseInfo(payment.courseId);
          if (courseInfo && courseInfo.title) {
            courseName = courseInfo.title;
            console.log(`📧 Using PaymentService course title "${courseName}" for payment confirmation email`);
          }
        }
      }
      // Bundle packages - use package name
      else if (payment.packageType === 'BUNDLE' || payment.courseId === '00000000-0000-0000-0000-000000000000') {
        console.log(`📧 Bundle payment detected - using package name: ${packageInfo.name}`);
        courseName = packageInfo.name;
      }
      
    } catch (error) {
      console.error('❌ Error getting course title for payment confirmation email:', error.message);
      // Keep the package name as fallback
    }

    // Final validation - ensure we have a valid course name
    if (!courseName || courseName === 'Unknown Course') {
      courseName = packageInfo.name || 'Course Package';
      console.warn(`⚠️ Using package name as final fallback: ${courseName}`);
    }

    console.log(`📧 Final course name for payment confirmation: "${courseName}"`);

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
    
    console.log(`✅ Payment confirmation email sent to: ${userInfo.email} with course name: ${courseName}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send payment confirmation email:', error.message);
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
    }
    
    // Log inputs to help with debugging
    console.log('Enrollment email - Payment:', payment ? payment.id : 'Not provided');
    console.log('Enrollment email - Package:', packageInfo ? packageInfo.name : 'Not provided');
    console.log('Enrollment email - CourseNames received:', courseNames);
    
    // Map course names to their specific date ranges
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
    
    // If courseNames is null or empty, try to fetch them
    if (!courseNames || !Array.isArray(courseNames) || courseNames.length === 0 || 
        courseNames.every(name => name === 'Unknown Course')) {
      console.log('No valid course names provided, attempting to fetch course information');
      
      try {
        // Import PaymentService dynamically to avoid circular dependencies
        const { PaymentService } = await import('../services/payment.service.js');
        
        if (payment.courseId) {
          // For single course payments
          const courseInfo = await PaymentService.getCourseInfo(payment.courseId);
          if (courseInfo && courseInfo.title) {
            courseNames = [courseInfo.title];
            console.log(`Fetched course title: ${courseInfo.title}`);
          }
        } else if (payment.packageId) {
          // For bundle packages, get all courses in the package
          const coursesInBundle = await PaymentService.getCoursesInPackage(payment.packageId);
          if (coursesInBundle && Array.isArray(coursesInBundle) && coursesInBundle.length > 0) {
            courseNames = coursesInBundle.map(course => course.title || course.name).filter(Boolean);
            console.log(`Fetched ${courseNames.length} course names from bundle`);
          }
        }
      } catch (error) {
        console.error('Error fetching course information for email:', error.message);
      }
    }

    // Build course name string, with better fallbacks
    const courseName = Array.isArray(courseNames) && courseNames.length > 0 && 
                      !courseNames.every(name => name === 'Unknown Course')
      ? courseNames.join(', ')
      : (packageInfo?.name || 'Your course');
      
    // Determine if this is a bundle (multiple courses)
    const isBundle = Array.isArray(courseNames) && courseNames.length > 1;
    
    // Format the start date
    let startDate;
    
    // Log to debug course schedule mapping
    console.log('Course names for schedule mapping:', courseNames);
    
    if (isBundle) {
      // For bundles, show each course with its date
      const courseWithDates = courseNames.map(name => {
        // Exact match first, then partial matches sorted by length (longest first)
        let scheduleKey = Object.keys(courseScheduleMap).find(key => key === name);
        
        if (!scheduleKey) {
          const sortedKeys = Object.keys(courseScheduleMap).sort((a, b) => b.length - a.length);
          scheduleKey = sortedKeys.find(key => 
            name.includes(key) || key.includes(name)
          );
        }
        
        const scheduleDate = scheduleKey ? courseScheduleMap[scheduleKey] : null;
        console.log(`Bundle course: "${name}", matched with: "${scheduleKey}", date: ${scheduleDate}`);
        
        return scheduleDate 
          ? `${name}: ${scheduleDate}` 
          : name;
      });
      startDate = courseWithDates.join(', ');
    } else {
      // For single course, just show the date
      const singleCourseName = Array.isArray(courseNames) ? courseNames[0] : packageInfo?.name;
      
      // Exact match first, then partial matches sorted by length (longest first)
      let scheduleKey = Object.keys(courseScheduleMap).find(key => key === singleCourseName);
      
      if (!scheduleKey) {
        const sortedKeys = Object.keys(courseScheduleMap).sort((a, b) => b.length - a.length);
        scheduleKey = sortedKeys.find(key => 
          singleCourseName && (singleCourseName.includes(key) || key.includes(singleCourseName))
        );
      }
      
      console.log(`Single course: "${singleCourseName}", matched with: "${scheduleKey}"`);
      
      if (scheduleKey && courseScheduleMap[scheduleKey]) {
        startDate = courseScheduleMap[scheduleKey];
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
        const emailPayload = {
          email: userInfo.email,
          username: userInfo.name || 'Student',
          courseName: courseName,
          startDate: startDate,
          courseLink: courseLink
        };
        
        console.log('Sending enrollment confirmation email with payload:', emailPayload);
        
        return await axios.post(
          `${EMAIL_SERVICE_URL}/email/enrollment-confirmation`,
          emailPayload,
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
    
    console.log(`Enrollment confirmation email sent to: ${userInfo.email} with course name: "${courseName}" and start date: "${startDate}"`);
    return true;
  } catch (error) {
    console.error('Failed to send enrollment confirmation email:', error.message);
    return false;
  }
};

// Add this deduplication helper function
export async function preventDuplicateEmail(key, emailSendingFn, ttlSeconds = 300) {
  try {
    // You can use Redis or a simple in-memory cache for this
    const { cache } = await import('./cache-helper.js');
    
    // Check if this email was recently sent
    const alreadySent = await cache.get(key);
    if (alreadySent) {
      console.log(`Preventing duplicate email with key: ${key}`);
      return false;
    }
    
    // Email hasn't been sent recently, proceed
    await emailSendingFn();
    
    // Mark this email as sent in the cache
    await cache.set(key, true, ttlSeconds);
    return true;
  } catch (error) {
    console.error('Error in deduplication check:', error);
    // If deduplication fails, proceed with sending anyway
    await emailSendingFn();
    return true;
  }
}
