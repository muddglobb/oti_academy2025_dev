/**
 * Cache configuration settings for payment service
 * These settings can be adjusted based on application load and requirements
 */

export const CACHE_CONFIG = {
  // TTL (Time To Live) settings in seconds
  ttl: {
    packages: 15 * 60, // 15 minutes
    courses: 15 * 60, // 15 minutes
    enrollments: 1 * 60, // 1 minutes
    users: 30 * 60, // 30 minutes
    default: 5 * 60 // 5 minutes default
  },
  
  // Maximum size settings (number of items)
  maxSize: {
    packages: 1000,
    courses: 1000,
    enrollments: 5000,
    users: 1000,
    default: 1000
  },
  
  // Retry settings
  retry: {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000
  },
  
  // Rate limiting settings
  rateLimit: {
    requestsPerSecond: 10,
    concurrentRequests: 5
  },
  
  // Check period for expired items (in seconds)
  checkPeriod: 120,
  
  // Controls whether to use clones or references (false = references for better performance)
  useClones: false,
  
  // Circuit breaker settings
  circuitBreaker: {
    failureThreshold: 5, // number of failures before opening circuit
    resetTimeoutMs: 30000, // time before attempting to close circuit
    halfOpenSuccess: 2 // successful calls needed in half-open state to close circuit
  }
};
