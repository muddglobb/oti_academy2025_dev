/**
 * Monitoring Controller for Rate Limiting
 * Provides endpoints for rate limiting statistics and health checks
 */

import { 
  getRateLimitStats, 
  resetRateLimitStats, 
  getHealthStatus 
} from '../utils/rate-limit-monitor.js';
import { ApiResponse } from '../utils/api-response.js';

/**
 * @desc    Get rate limiting statistics
 * @route   GET /api/monitoring/rate-limits
 * @access  Admin only
 */
export const getRateLimitingStats = async (req, res) => {
  try {
    const stats = getRateLimitStats();
    
    res.status(200).json(
      ApiResponse.success(stats, 'Rate limiting statistics retrieved successfully')
    );
  } catch (error) {
    console.error('Error getting rate limiting stats:', error);
    res.status(500).json(
      ApiResponse.error('Failed to retrieve rate limiting statistics')
    );
  }
};

/**
 * @desc    Get rate limiting health status
 * @route   GET /api/monitoring/rate-limits/health
 * @access  Admin only
 */
export const getRateLimitingHealth = async (req, res) => {
  try {
    const healthStatus = getHealthStatus();
    const stats = getRateLimitStats();
    
    const responseData = {
      ...healthStatus,
      summary: stats.summary,
      timestamp: new Date().toISOString()
    };
    
    // Set appropriate HTTP status based on health
    let httpStatus = 200;
    if (healthStatus.status === 'warning') httpStatus = 200;
    if (healthStatus.status === 'critical') httpStatus = 503;
    
    res.status(httpStatus).json(
      ApiResponse.success(responseData, `Rate limiting status: ${healthStatus.status}`)
    );
  } catch (error) {
    console.error('Error getting rate limiting health:', error);
    res.status(500).json(
      ApiResponse.error('Failed to retrieve rate limiting health status')
    );
  }
};

/**
 * @desc    Reset rate limiting statistics
 * @route   POST /api/monitoring/rate-limits/reset
 * @access  Admin only
 */
export const resetRateLimitingStats = async (req, res) => {
  try {
    resetRateLimitStats();
    
    res.status(200).json(
      ApiResponse.success({}, 'Rate limiting statistics reset successfully')
    );
  } catch (error) {
    console.error('Error resetting rate limiting stats:', error);
    res.status(500).json(
      ApiResponse.error('Failed to reset rate limiting statistics')
    );
  }
};

/**
 * @desc    Get comprehensive monitoring dashboard data
 * @route   GET /api/monitoring/dashboard
 * @access  Admin only
 */
export const getMonitoringDashboard = async (req, res) => {
  try {
    const rateLimitStats = getRateLimitStats();
    const healthStatus = getHealthStatus();
    
    const dashboardData = {
      timestamp: new Date().toISOString(),
      uptime: rateLimitStats.uptime,
      health: healthStatus,
      rateLimiting: {
        summary: rateLimitStats.summary,
        endpoints: rateLimitStats.endpoints,
        serviceCallsStats: rateLimitStats.serviceCallsStats,
        topIPs: rateLimitStats.topIPs,
        recentEvents: rateLimitStats.recentEvents
      },
      systemInfo: {
        nodeVersion: process.version,
        nodeEnv: process.env.NODE_ENV,
        memoryUsage: process.memoryUsage(),
        pid: process.pid
      }
    };
    
    res.status(200).json(
      ApiResponse.success(dashboardData, 'Monitoring dashboard data retrieved successfully')
    );
  } catch (error) {
    console.error('Error getting monitoring dashboard:', error);
    res.status(500).json(
      ApiResponse.error('Failed to retrieve monitoring dashboard data')
    );
  }
};
