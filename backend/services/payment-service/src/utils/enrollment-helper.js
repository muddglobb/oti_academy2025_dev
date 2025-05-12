/**
 * Utility untuk mengelola integrasi dengan enrollment service
 * Melakukan integrasi langsung ke enrollment service via API calls with rate limiting
 */
import axios from 'axios';
import http from 'http';
import https from 'https';
import { PaymentService } from '../services/payment.service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URL and API key configuration for enrollment service
// For Railway deployment, we use the public URL of the enrollment service
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
 * Get enrollment status for a specific user and course
 * @param {string} userId - ID of the user
 * @param {string} courseId - ID of the course
 * @returns {Promise<Object>} Enrollment status
 */
export const checkEnrollmentStatus = async (userId, courseId) => {  
  try {
    console.log(`Checking enrollment status for user ${userId} in course ${courseId}`);
    
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: 'ENROLLED'
      }
    });
    
    const result = {
      isEnrolled: !!enrollment,
      message: enrollment ? 'User is enrolled' : 'User is not enrolled',
      enrollmentId: enrollment?.id || null,
      createdAt: enrollment?.createdAt || null
    };
    
    console.log(`Enrollment status result: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error('❌ Error checking enrollment status:', error.message);
    // Return a default response instead of throwing the error
    return { isEnrolled: false, message: 'Failed to verify enrollment status' };
  }
};

