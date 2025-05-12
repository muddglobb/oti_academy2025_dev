/**
 * Cache monitoring utility to help track and analyze cache performance
 */
import { CACHE_CONFIG } from '../config/cache.config.js';

// Tracking stats for cache performance
const cacheStats = {
  hits: {
    package: 0,
    courses: 0,
    enrollment: 0
  },
  misses: {
    package: 0,
    courses: 0,
    enrollment: 0
  },
  errors: {
    package: 0,
    courses: 0,
    enrollment: 0
  },
  apiCalls: {
    package: 0,
    courses: 0,
    enrollment: 0
  },
  rateLimitEvents: 0,
  totalRequests: 0,
  lastReset: Date.now()
};

/**
 * Record a cache hit
 * @param {string} cacheType - Type of cache (package, courses, enrollment)
 */
export function recordCacheHit(cacheType) {
  if (cacheStats.hits[cacheType] !== undefined) {
    cacheStats.hits[cacheType]++;
  }
  cacheStats.totalRequests++;
}

/**
 * Record a cache miss
 * @param {string} cacheType - Type of cache (package, courses, enrollment)
 */
export function recordCacheMiss(cacheType) {
  if (cacheStats.misses[cacheType] !== undefined) {
    cacheStats.misses[cacheType]++;
  }
  cacheStats.totalRequests++;
}

/**
 * Record an API call
 * @param {string} apiType - Type of API call (package, courses, enrollment)
 */
export function recordApiCall(apiType) {
  if (cacheStats.apiCalls[apiType] !== undefined) {
    cacheStats.apiCalls[apiType]++;
  }
}

/**
 * Record a cache error
 * @param {string} cacheType - Type of cache (package, courses, enrollment)
 */
export function recordCacheError(cacheType) {
  if (cacheStats.errors[cacheType] !== undefined) {
    cacheStats.errors[cacheType]++;
  }
}

/**
 * Record a rate limit event
 */
export function recordRateLimitEvent() {
  cacheStats.rateLimitEvents++;
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  const now = Date.now();
  const uptime = Math.round((now - cacheStats.lastReset) / 1000);
  
  // Calculate hit rates
  const calculatedStats = {
    uptime: uptime,
    totalRequests: cacheStats.totalRequests,
    rateLimitEvents: cacheStats.rateLimitEvents,
    hitRatePercentage: {}
  };
  
  // Calculate hit rates for each cache type
  for (const cacheType in cacheStats.hits) {
    const hits = cacheStats.hits[cacheType];
    const misses = cacheStats.misses[cacheType];
    const total = hits + misses;
    
    if (total > 0) {
      calculatedStats.hitRatePercentage[cacheType] = Math.round((hits / total) * 100);
    } else {
      calculatedStats.hitRatePercentage[cacheType] = 0;
    }
    
    calculatedStats[cacheType] = {
      hits,
      misses,
      errors: cacheStats.errors[cacheType],
      apiCalls: cacheStats.apiCalls[cacheType]
    };
  }
  
  return calculatedStats;
}

/**
 * Reset cache statistics
 */
export function resetCacheStats() {
  for (const cacheType in cacheStats.hits) {
    cacheStats.hits[cacheType] = 0;
    cacheStats.misses[cacheType] = 0;
    cacheStats.errors[cacheType] = 0;
    cacheStats.apiCalls[cacheType] = 0;
  }
  
  cacheStats.rateLimitEvents = 0;
  cacheStats.totalRequests = 0;
  cacheStats.lastReset = Date.now();
}

/**
 * Apply optimized cache settings based on current application load
 * @param {Object} loadMetrics - Current load metrics of the application
 */
export function optimizeCacheSettings(loadMetrics) {
  // Example implementation - would be adjusted based on actual monitoring
  if (loadMetrics.highTraffic) {
    // Under high load, keep cache items longer
    CACHE_CONFIG.ttl.packages = 30 * 60; // 30 minutes
    CACHE_CONFIG.ttl.courses = 30 * 60; // 30 minutes
    CACHE_CONFIG.ttl.enrollments = 10 * 60; // 10 minutes
  } else {
    // Under normal load, use default values
    CACHE_CONFIG.ttl.packages = 15 * 60; // 15 minutes
    CACHE_CONFIG.ttl.courses = 15 * 60; // 15 minutes
    CACHE_CONFIG.ttl.enrollments = 5 * 60; // 5 minutes
  }
}
