/**
 * Cache utility for storing and retrieving data to reduce API calls
 * This helps prevent rate limiting issues with other microservices
 */
import NodeCache from 'node-cache';
import { CACHE_CONFIG } from '../config/cache.config.js';

// Load TTL settings from config
const DEFAULT_TTL = CACHE_CONFIG.ttl.default;
const PACKAGE_INFO_TTL = CACHE_CONFIG.ttl.packages;
const COURSES_IN_PACKAGE_TTL = CACHE_CONFIG.ttl.courses;
const ENROLLMENT_COUNT_TTL = CACHE_CONFIG.ttl.enrollments;

// Create cache instances with automatic key deletion when expired
const packageCache = new NodeCache({ 
  stdTTL: PACKAGE_INFO_TTL,
  checkperiod: CACHE_CONFIG.checkPeriod,
  useClones: CACHE_CONFIG.useClones,
  maxKeys: CACHE_CONFIG.maxSize.packages
});

const coursesCache = new NodeCache({ 
  stdTTL: COURSES_IN_PACKAGE_TTL,
  checkperiod: CACHE_CONFIG.checkPeriod, 
  useClones: CACHE_CONFIG.useClones,
  maxKeys: CACHE_CONFIG.maxSize.courses
});

const enrollmentCountCache = new NodeCache({ 
  stdTTL: ENROLLMENT_COUNT_TTL,
  checkperiod: CACHE_CONFIG.checkPeriod, 
  useClones: CACHE_CONFIG.useClones,
  maxKeys: CACHE_CONFIG.maxSize.enrollments
});

/**
 * Get item from cache or fetch it from the source function
 * @param {NodeCache} cache - Cache instance to use
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to call if cache miss
 * @param {number} ttl - Time to live in seconds
 * @param {string} cacheType - Type of cache for monitoring (package, courses, enrollment)
 * @returns {Promise<any>} - Cached or fresh data
 */
async function getOrSet(cache, key, fetchFn, ttl = DEFAULT_TTL, cacheType = 'default') {
  // Import monitoring utilities
  const { recordCacheHit, recordCacheMiss, recordApiCall, recordCacheError } = await import('./cache-monitor.js');
  
  // Try to get from cache first
  const cachedItem = cache.get(key);
  if (cachedItem !== undefined) {
    // Record cache hit for monitoring
    recordCacheHit(cacheType);
    return cachedItem;
  }

  // Record cache miss for monitoring
  recordCacheMiss(cacheType);
  
  try {
    // Cache miss - fetch fresh data
    recordApiCall(cacheType);
    const freshData = await fetchFn();
    
    // Only cache if we got valid data
    if (freshData !== null && freshData !== undefined) {
      cache.set(key, freshData, ttl);
    }
    
    return freshData;
  } catch (error) {
    recordCacheError(cacheType);
    console.error(`Cache fetch error for key ${key}:`, error.message);
    throw error;
  }
}

/**
 * Get package information by ID with caching
 * @param {string} packageId - Package ID
 * @param {Function} fetchFn - Function to fetch package info if not cached
 * @returns {Promise<Object>} Package information
 */
export const getPackageInfoCached = async (packageId, fetchFn) => {
  return await getOrSet(packageCache, `package:${packageId}`, fetchFn, PACKAGE_INFO_TTL, 'package');
};

/**
 * Get courses in a package with caching
 * @param {string} packageId - Package ID
 * @param {Function} fetchFn - Function to fetch courses if not cached
 * @returns {Promise<Array>} List of courses in the package
 */
export const getCoursesInPackageCached = async (packageId, fetchFn) => {
  return await getOrSet(coursesCache, `courses:${packageId}`, fetchFn, COURSES_IN_PACKAGE_TTL, 'courses');
};

/**
 * Get course enrollment count with caching
 * @param {string} courseId - Course ID
 * @param {Function} fetchFn - Function to calculate enrollment count if not cached
 * @returns {Promise<Object>} Enrollment count details
 */
export const getCourseEnrollmentCountCached = async (courseId, fetchFn) => {
  return await getOrSet(enrollmentCountCache, `enrollment:${courseId}`, fetchFn, ENROLLMENT_COUNT_TTL, 'enrollment');
};

/**
 * Get all courses enrollment count with caching
 * @param {string} cacheKey - Unique cache key
 * @param {Function} fetchFn - Function to calculate all enrollments if not cached
 * @returns {Promise<Object>} All course enrollment counts
 */
export const getAllCoursesEnrollmentCountCached = async (cacheKey, fetchFn) => {
  return await getOrSet(enrollmentCountCache, cacheKey, fetchFn, ENROLLMENT_COUNT_TTL, 'enrollment');
};

/**
 * Manually invalidate cache for a specific key
 * @param {string} type - Type of cache ('package', 'courses', 'enrollment')
 * @param {string} id - ID to invalidate
 */
export const invalidateCache = (type, id) => {
  switch (type) {
    case 'package':
      packageCache.del(`package:${id}`);
      break;
    case 'courses':
      coursesCache.del(`courses:${id}`);
      break;
    case 'enrollment':
      enrollmentCountCache.del(`enrollment:${id}`);
      break;
    case 'all-enrollments':
      enrollmentCountCache.del('all-enrollments');
      break;
    default:
      // Invalid cache type
      break;
  }
};

/**
 * Batch preload package info into cache
 * @param {string[]} packageIds - Array of package IDs
 * @param {Function} fetchFn - Function to fetch package info (takes packageId as parameter)
 * @returns {Promise<void>}
 */
export const batchPreloadPackageInfo = async (packageIds, fetchFn) => {
  const uniqueIds = [...new Set(packageIds)];
  
  // Filter to only include IDs not already in cache
  const uncachedIds = uniqueIds.filter(id => !packageCache.has(`package:${id}`));
  
  if (uncachedIds.length === 0) return;
  
  // Fetch all uncached packages
  const results = await Promise.all(uncachedIds.map(async id => {
    try {
      const data = await fetchFn(id);
      return { id, data };
    } catch (error) {
      console.error(`Error preloading package ${id}:`, error.message);
      return { id, data: null };
    }
  }));
  
  // Store valid results in cache
  results.forEach(({ id, data }) => {
    if (data !== null) {
      packageCache.set(`package:${id}`, data, PACKAGE_INFO_TTL);
    }
  });
};
