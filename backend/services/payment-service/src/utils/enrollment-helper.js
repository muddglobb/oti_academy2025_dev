/**
 * Utility untuk mengelola integrasi dengan enrollment service
 * Melakukan integrasi langsung ke enrollment service via API calls with rate limiting
 */
import axios from 'axios';
import http from 'http';
import https from 'https';
import { PaymentService } from '../services/payment.service.js';

// URL and API key configuration for enrollment service
// For Railway deployment, we use the public URL of the enrollment service
const ENROLLMENT_SERVICE_URL = process.env.ENROLLMENT_SERVICE_URL || 'http://enrollment-service-api:8007';
const SERVICE_API_KEY = process.env.SERVICE_API_KEY;
const TOKEN_EXPIRY = 55 * 60 * 1000; // 55 minutes in ms

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequestsPerSecond: 10,
  maxConcurrentRequests: 5,
  defaultBackoffMs: 1000,
  maxBackoffMs: 30000,
  maxCacheSize: 1000
};

// Rate limiting state
const rateLimitState = {
  requestQueue: [],
  activeRequests: 0,
  requestsThisSecond: 0,
  lastRequestTimestamp: 0,
  isThrottled: false,
  throttleUntil: 0,
  consecutiveErrors: 0,
  remainingQuota: 100
};

// Token cache to avoid generating a new token for each request
const tokenCache = new Map();

// Create axios instance with connection pooling
const enrollmentClient = axios.create({
  baseURL: ENROLLMENT_SERVICE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'x-service-api-key': SERVICE_API_KEY
  },
  // Enable connection reuse
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
});

/**
 * Generate or retrieve a cached service token
 * @param {string} userId - User ID to include in the token
 * @returns {Promise<string>} JWT service token
 */
async function getServiceToken(userId) {
  const cacheKey = `token-${userId}`;
  const cached = tokenCache.get(cacheKey);
  
  // Return cached token if still valid
  if (cached && (Date.now() < cached.expiresAt)) {
    // Move to end of Map to implement LRU behavior
    tokenCache.delete(cacheKey);
    tokenCache.set(cacheKey, cached);
    return cached.token;
  }
  
  // Generate new token
  const jwt = await import('jsonwebtoken');
  const token = jwt.default.sign(
    { id: userId, role: 'SERVICE' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // Limit cache size to prevent memory leaks
  if (tokenCache.size >= RATE_LIMIT_CONFIG.maxCacheSize) {
    // Delete oldest entry (first key in map)
    const oldestKey = tokenCache.keys().next().value;
    tokenCache.delete(oldestKey);
  }
  
  // Cache token
  tokenCache.set(cacheKey, {
    token,
    expiresAt: Date.now() + TOKEN_EXPIRY
  });
  
  return token;
}

/**
 * Queue a request with rate limiting awareness
 * @param {Function} fn - The request function to execute
 * @param {Object} options - Options for the request
 * @returns {Promise<*>} - Result of the request
 */
const queueRateLimitedRequest = (fn, options = {}) => {
  const { maxRetries = 3, initialDelay = 1000 } = options;
  
  return new Promise((resolve, reject) => {
    const executeWithRateLimit = async () => {
      // Check if we're throttled
      if (rateLimitState.isThrottled) {
        const now = Date.now();
        if (now < rateLimitState.throttleUntil) {
          const waitTime = rateLimitState.throttleUntil - now;
          await new Promise(r => setTimeout(r, waitTime));
        }
        rateLimitState.isThrottled = false;
      }

      // Check concurrent request limit
      if (rateLimitState.activeRequests >= RATE_LIMIT_CONFIG.maxConcurrentRequests) {
        // Queue for later and return
        rateLimitState.requestQueue.push(() => executeWithRateLimit().then(resolve).catch(reject));
        return;
      }

      // Check rate limit (requests/second)
      const now = Date.now();
      if (now - rateLimitState.lastRequestTimestamp < 1000) {
        if (rateLimitState.requestsThisSecond >= RATE_LIMIT_CONFIG.maxRequestsPerSecond) {
          // Queue for next second
          const waitTime = 1000 - (now - rateLimitState.lastRequestTimestamp) + 50; // Add 50ms buffer
          setTimeout(() => executeWithRateLimit().then(resolve).catch(reject), waitTime);
          return;
        }
        rateLimitState.requestsThisSecond++;
      } else {
        // Reset counter for new second
        rateLimitState.lastRequestTimestamp = now;
        rateLimitState.requestsThisSecond = 1;
      }

      // Execute the request with retries
      rateLimitState.activeRequests++;
      
      try {
        // Use the retry operation function
        const result = await retryOperation(fn, maxRetries, initialDelay);
        
        // Request succeeded, reduce error count
        rateLimitState.consecutiveErrors = 0;
        
        resolve(result);
      } catch (error) {
        // Check if it's a rate limit error
        if (error.response && error.response.status === 429) {
          // Extract retry-after if available
          let retryAfter = 60; // Default 60 seconds
          if (error.response.headers && error.response.headers['retry-after']) {
            retryAfter = parseInt(error.response.headers['retry-after'], 10);
          }
          
          console.warn(`🚦 Rate limit hit. Backing off for ${retryAfter} seconds.`);
          
          // Set throttle state
          rateLimitState.isThrottled = true;
          rateLimitState.throttleUntil = Date.now() + (retryAfter * 1000);
          
          // Requeue the request after the backoff period
          setTimeout(() => executeWithRateLimit().then(resolve).catch(reject), 
            retryAfter * 1000 + 100);
        } else {
          // Other error, increment counter
          rateLimitState.consecutiveErrors++;
          
          // If too many errors, trigger circuit breaker
          if (rateLimitState.consecutiveErrors >= 5) {
            const breakerTime = Math.min(
              5000 * Math.pow(2, rateLimitState.consecutiveErrors - 5),
              RATE_LIMIT_CONFIG.maxBackoffMs
            );
            
            console.warn(`🔌 Circuit breaker triggered. Pausing requests for ${Math.round(breakerTime/1000)} seconds`);
            
            rateLimitState.isThrottled = true;
            rateLimitState.throttleUntil = Date.now() + breakerTime;
          }
          
          reject(error);
        }
      } finally {
        rateLimitState.activeRequests--;
        
        // Process next queued request if any
        if (rateLimitState.requestQueue.length > 0) {
          const nextRequest = rateLimitState.requestQueue.shift();
          nextRequest();
        }
      }
    };
    
    // Start execution
    executeWithRateLimit();
  });
};

/**
 * Mencoba ulang fungsi sebanyak beberapa kali jika terjadi error
 * @param {Function} fn - Fungsi yang akan dicoba ulang
 * @param {number} maxRetries - Jumlah maksimum percobaan
 * @param {number} delay - Delay dalam ms antara percobaan
 * @returns {Promise<*>} Hasil dari fungsi
 */
const retryOperation = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fn();
      
      // Check for and update rate limit info from headers
      if (response && response.headers) {
        if (response.headers['ratelimit-remaining']) {
          rateLimitState.remainingQuota = parseInt(response.headers['ratelimit-remaining'], 10);
        }
        
        if (rateLimitState.remainingQuota < 10) {
          // Getting close to the limit, slow down
          console.warn(`⚠️ Rate limit quota low: ${rateLimitState.remainingQuota} remaining`);
        }
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // Detect rate limit error
      if (error.response && error.response.status === 429) {
        throw error; // Let the queueRateLimitedRequest handler deal with it
      }
      
      // Only log detailed error info on final attempt or server errors
      if (attempt === maxRetries || (error.response && error.response.status >= 500)) {
        console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
        if (error.response) {
          console.error(`Status: ${error.response.status}, Data:`, error.response.data);
        }
      } else {
        console.warn(`Attempt ${attempt}/${maxRetries} failed, retrying...`);
      }
      
      // Calculate exponential backoff with jitter for more efficient retries
      if (attempt < maxRetries) {
        const backoffDelay = delay * Math.pow(1.5, attempt - 1) * (0.9 + Math.random() * 0.2);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Mengirim notifikasi ke enrollment service via API untuk membuat pendaftaran baru
 * @param {Object} payment - Data pembayaran yang sudah disetujui
 * @param {Object} userInfo - Informasi user tambahan (opsional)
 * @returns {Promise<Object>} Status enrollment
 */
export const createEnrollmentAfterPayment = async (payment, userInfo = null) => {
  // First check if the payment is already approved
  // If it is, then enrollment should have already been created in the transaction
  if (payment.status === 'APPROVED') {
  try {
    // For direct enrollment, check specific course enrollment
    if (payment.courseId) {
      const status = await checkEnrollmentStatus(payment.userId, payment.courseId);
      if (status.isEnrolled) {
        console.log(`✅ User ${payment.userId} is already enrolled in course ${payment.courseId}`);
        return {
          status: 'verified',
          message: 'User is already enrolled',
          enrollments: []
        };
      }
    } else {
      // For bundle payments, we could check one of the courses in the bundle
      // Getting the first course in the package as a representative
      const packageInfo = await PaymentService.getPackageInfo(payment.packageId);
      const isBundle = packageInfo && packageInfo.type === 'BUNDLE';
      
      if (isBundle) {
        const coursesInBundle = await PaymentService.getCoursesInPackage(payment.packageId);
        if (coursesInBundle && coursesInBundle.length > 0) {
          const firstCourse = coursesInBundle[0];
          const courseId = firstCourse.id || firstCourse.courseId;
          
          if (courseId) {
            const status = await checkEnrollmentStatus(payment.userId, courseId);
            if (status.isEnrolled) {
              console.log(`✅ User ${payment.userId} is already enrolled in bundle course ${courseId}`);
              return {
                status: 'verified',
                message: 'User is already enrolled in bundle',
                enrollments: []
              };
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error checking enrollment status: ${error.message}`);
  }
}
  
  try {
    // Generate a service token for more secure service-to-service communication
    const serviceToken = await getServiceToken(payment.userId);
    
    // Get package info to determine if it's a bundle
    const packageInfo = await PaymentService.getPackageInfo(payment.packageId);
    const isBundle = packageInfo && packageInfo.type === 'BUNDLE';
    
    let courseIds = [];

  // Determine which courses to enroll based on package type
    if (isBundle) {
      // For bundle packages, get all courses in the package
      const coursesInBundle = await PaymentService.getCoursesInPackage(payment.packageId);
      
      // Add debugging to see what's coming back from the package service
      console.log(`Retrieved ${coursesInBundle ? coursesInBundle.length : 0} courses in bundle for package ${payment.packageId}`);
      
      if (coursesInBundle && Array.isArray(coursesInBundle)) {
        // Try different property paths that might contain the ID
        courseIds = coursesInBundle.map(course => {
          // Log the first course to understand its structure
          if (coursesInBundle.indexOf(course) === 0) {
            console.log('First course in bundle structure:', JSON.stringify(course));
          }
          
          // Try common property paths for course ID
          return course.id || course.courseId || (course.course && course.course.id);
        }).filter(id => id); // Remove any undefined/null values
      }
    } else {
      // For ENTRY and INTERMEDIATE packages, use only the selected course
      if (payment.courseId) {
        courseIds = [payment.courseId];
        console.log(`Using selected course ID: ${payment.courseId}`);
      } else {
        console.warn(`⚠️ Payment ${payment.id} has no courseId for a non-bundle package`);
      }
    }
    
    // Add a debug log to show the final courseIds
    console.log(`Final courseIds for enrollment: ${JSON.stringify(courseIds)}`);
    
    // Skip API call if no courses to enroll (should never happen, but just in case)
    if (courseIds.length === 0) {
      console.warn(`⚠️ No courses found for payment ${payment.id}, skipping enrollment`);
      return {
        status: 'skipped',
        message: 'No courses to enroll',
        enrollments: []
      };
    }

    // Prepare data for enrollment API call
    const enrollmentData = {
      userId: payment.userId,
      packageId: payment.packageId,
      courseIds: courseIds
    };    // Call enrollment service API with retry mechanism
    const response = await retryOperation(async () => {
      return await axios.post(
        `${ENROLLMENT_SERVICE_URL}/enrollments/payment-approved`,
        enrollmentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-service-api-key': SERVICE_API_KEY,
            'Authorization': `Bearer ${serviceToken}` // Add token for better security
          },
          // Timeout to prevent long-hanging requests
          timeout: 8000,
          // Add retry logic for Railway deployment where network might be unstable
          validateStatus: status => status < 500 // Only reject if the status code is 5xx
        }
      );
    }, 3, 2000); // Try 3 times with 2 seconds delay between attempts

    console.log(`✅ Enrollment created via API: User ${payment.userId} enrolled in ${courseIds.length} courses`);
    
    return {
      status: 'enrolled',
      message: 'User enrolled in courses successfully',
      enrollments: response.data.data.enrollments
    };
      } catch (error) {
    console.error('❌ Error creating enrollment via API:', error.message);
    // More detailed error logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    // Fallback: Save to local file for later processing if API calls fail
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      // Create a fallback directory
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const fallbackDir = path.join(__dirname, '..', '..', 'enrollment-fallback');
      
      // Ensure the directory exists
      await fs.mkdir(fallbackDir, { recursive: true });
      
      // Create a fallback file with timestamp
      const fallbackFile = path.join(
        fallbackDir, 
        `fallback-${payment.id}-${Date.now()}.json`
      );
      
      // Save enrollment data for later processing
      await fs.writeFile(
        fallbackFile,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          apiError: error.message,
          enrollmentData,
          payment
        }, null, 2),
        'utf-8'
      );
      
      console.log(`⚠️ Enrollment API failed, saved fallback data to: ${fallbackFile}`);
      
      // Return partial success to prevent payment process from failing
      return {
        status: 'queued',
        message: 'Enrollment queued via fallback system',
        fallbackFile
      };
    } catch (fallbackError) {
      console.error('❌ Even fallback enrollment storage failed:', fallbackError.message);
      // Finally throw the original error if even the fallback fails
      throw error;
    }
  }
};

/**
 * Get enrollment status for a specific user and course
 * @param {string} userId - ID of the user
 * @param {string} courseId - ID of the course
 * @returns {Promise<Object>} Enrollment status
 */
export const checkEnrollmentStatus = async (userId, courseId) => {  
  try {
    // Use cached or generate new service token
    const serviceToken = await getServiceToken(userId);
    
    // Use retryOperation for enrollment status checks for better reliability
    const response = await retryOperation(async () => {
      console.log(`Checking enrollment status for user ${userId} in course ${courseId}`);
      return await axios.get(
        `${ENROLLMENT_SERVICE_URL}/enrollments/service/${courseId}/status`, 
        {
          headers: {
            'Content-Type': 'application/json',
            'x-service-api-key': SERVICE_API_KEY,
            'Authorization': `Bearer ${serviceToken}`,
            'x-user-id': userId // Include user ID in header as fallback
          },
          // Timeout to prevent long-hanging requests
          timeout: 5000
        }
      );
    }, 2, 1000); // 2 retries with 1 second initial delay
    
    console.log(`Enrollment status response: ${JSON.stringify(response.data)}`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error checking enrollment status:', error.message);
    // Return a default response instead of throwing the error
    // This prevents the application from crashing if the enrollment service is down
    return { isEnrolled: false, message: 'Failed to verify enrollment status' };
  }
};

/**
 * Check enrollment status for multiple courses at once
 * @param {string} userId - User ID
 * @param {string[]} courseIds - Array of course IDs to check
 * @returns {Promise<Object>} Map of courseId to enrollment status
 */
export const batchCheckEnrollmentStatus = async (userId, courseIds) => {
  if (!courseIds || courseIds.length === 0) {
    return {};
  }
  
  // Filter out duplicates
  const uniqueCourseIds = [...new Set(courseIds)];
  const serviceToken = await getServiceToken(userId);
  const results = {};
  
  // Use Promise.allSettled to continue even if some requests fail
  const promises = uniqueCourseIds.map(courseId => 
    axios.get(
      `${ENROLLMENT_SERVICE_URL}/enrollments/service/${courseId}/status`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-service-api-key': SERVICE_API_KEY,
          'Authorization': `Bearer ${serviceToken}`,
          'x-user-id': userId
        },
        timeout: 5000
      }
    )
    .then(response => {
      results[courseId] = response.data.data;
      return { courseId, success: true };
    })
    .catch(error => {
      console.error(`Error checking enrollment for course ${courseId}:`, error.message);
      results[courseId] = { isEnrolled: false, message: 'Failed to verify enrollment status' };
      return { courseId, success: false, error: error.message };
    })
  );
  
  await Promise.allSettled(promises);
  return results;
};
