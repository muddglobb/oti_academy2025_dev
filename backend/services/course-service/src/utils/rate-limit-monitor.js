/**
 * Rate Limiting Monitor Utility
 * Tracks rate limiting events and provides monitoring capabilities
 */

// Rate limiting statistics
const rateLimitStats = {
  // General stats
  totalRequests: 0,
  rateLimitEvents: 0,
  serviceExemptions: 0,
  lastReset: Date.now(),
  
  // Breakdown by endpoint
  endpoints: {
    '/courses': { requests: 0, rateLimits: 0, exemptions: 0 },
    '/courses/batch': { requests: 0, rateLimits: 0, exemptions: 0 },
    '/admin/courses': { requests: 0, rateLimits: 0, exemptions: 0 },
    '/sessions': { requests: 0, rateLimits: 0, exemptions: 0 }
  },
  
  // Breakdown by service source
  serviceCallsStats: {
    'package-service': { requests: 0, exemptions: 0 },
    'payment-service': { requests: 0, exemptions: 0 },
    'api-gateway': { requests: 0, exemptions: 0 },
    'unknown-service': { requests: 0, exemptions: 0 }
  },
  
  // IP-based tracking
  ipStats: {},
  
  // Recent rate limit events (last 100)
  recentEvents: []
};

/**
 * Record a request
 * @param {string} endpoint - The endpoint being accessed
 * @param {string} clientIP - Client IP address
 */
export function recordRequest(endpoint, clientIP) {
  rateLimitStats.totalRequests++;
  
  // Normalize endpoint for tracking
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  if (rateLimitStats.endpoints[normalizedEndpoint]) {
    rateLimitStats.endpoints[normalizedEndpoint].requests++;
  }
  
  // Track IP stats
  if (!rateLimitStats.ipStats[clientIP]) {
    rateLimitStats.ipStats[clientIP] = { requests: 0, rateLimits: 0, exemptions: 0 };
  }
  rateLimitStats.ipStats[clientIP].requests++;
}

/**
 * Record a rate limit event
 * @param {string} endpoint - The endpoint being accessed
 * @param {string} clientIP - Client IP address
 * @param {Object} requestDetails - Additional request details
 */
export function recordRateLimit(endpoint, clientIP, requestDetails = {}) {
  rateLimitStats.rateLimitEvents++;
  
  // Normalize endpoint for tracking
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  if (rateLimitStats.endpoints[normalizedEndpoint]) {
    rateLimitStats.endpoints[normalizedEndpoint].rateLimits++;
  }
  
  // Track IP stats
  if (!rateLimitStats.ipStats[clientIP]) {
    rateLimitStats.ipStats[clientIP] = { requests: 0, rateLimits: 0, exemptions: 0 };
  }
  rateLimitStats.ipStats[clientIP].rateLimits++;
  
  // Add to recent events
  const event = {
    timestamp: new Date().toISOString(),
    endpoint: normalizedEndpoint,
    clientIP: clientIP,
    userAgent: requestDetails.userAgent || 'unknown',
    method: requestDetails.method || 'unknown'
  };
  
  rateLimitStats.recentEvents.push(event);
  
  // Keep only last 100 events
  if (rateLimitStats.recentEvents.length > 100) {
    rateLimitStats.recentEvents.shift();
  }
}

/**
 * Record a service exemption
 * @param {string} endpoint - The endpoint being accessed
 * @param {string} clientIP - Client IP address
 * @param {string} exemptionType - Type of exemption (IP, token, api-key)
 * @param {string} serviceSource - Source service if identifiable
 */
export function recordServiceExemption(endpoint, clientIP, exemptionType, serviceSource = 'unknown-service') {
  rateLimitStats.serviceExemptions++;
  
  // Normalize endpoint for tracking
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  if (rateLimitStats.endpoints[normalizedEndpoint]) {
    rateLimitStats.endpoints[normalizedEndpoint].exemptions++;
  }
  
  // Track service calls
  if (!rateLimitStats.serviceCallsStats[serviceSource]) {
    rateLimitStats.serviceCallsStats[serviceSource] = { requests: 0, exemptions: 0 };
  }
  rateLimitStats.serviceCallsStats[serviceSource].requests++;
  rateLimitStats.serviceCallsStats[serviceSource].exemptions++;
  
  // Track IP stats
  if (!rateLimitStats.ipStats[clientIP]) {
    rateLimitStats.ipStats[clientIP] = { requests: 0, rateLimits: 0, exemptions: 0 };
  }
  rateLimitStats.ipStats[clientIP].exemptions++;
}

/**
 * Get rate limiting statistics
 * @returns {Object} Rate limiting statistics
 */
export function getRateLimitStats() {
  const now = Date.now();
  const uptime = Math.round((now - rateLimitStats.lastReset) / 1000);
  
  // Calculate percentages
  const rateLimitPercentage = rateLimitStats.totalRequests > 0 
    ? Math.round((rateLimitStats.rateLimitEvents / rateLimitStats.totalRequests) * 100)
    : 0;
    
  const exemptionPercentage = rateLimitStats.totalRequests > 0 
    ? Math.round((rateLimitStats.serviceExemptions / rateLimitStats.totalRequests) * 100)
    : 0;
  
  // Get top IPs by requests (limit to 10)
  const topIPs = Object.entries(rateLimitStats.ipStats)
    .sort(([,a], [,b]) => b.requests - a.requests)
    .slice(0, 10)
    .map(([ip, stats]) => ({ ip, ...stats }));
  
  return {
    uptime: uptime,
    summary: {
      totalRequests: rateLimitStats.totalRequests,
      rateLimitEvents: rateLimitStats.rateLimitEvents,
      serviceExemptions: rateLimitStats.serviceExemptions,
      rateLimitPercentage,
      exemptionPercentage
    },
    endpoints: rateLimitStats.endpoints,
    serviceCallsStats: rateLimitStats.serviceCallsStats,
    topIPs,
    recentEvents: rateLimitStats.recentEvents.slice(-10) // Last 10 events
  };
}

/**
 * Reset rate limiting statistics
 */
export function resetRateLimitStats() {
  rateLimitStats.totalRequests = 0;
  rateLimitStats.rateLimitEvents = 0;
  rateLimitStats.serviceExemptions = 0;
  rateLimitStats.lastReset = Date.now();
  
  // Reset endpoint stats
  Object.keys(rateLimitStats.endpoints).forEach(endpoint => {
    rateLimitStats.endpoints[endpoint] = { requests: 0, rateLimits: 0, exemptions: 0 };
  });
  
  // Reset service stats
  Object.keys(rateLimitStats.serviceCallsStats).forEach(service => {
    rateLimitStats.serviceCallsStats[service] = { requests: 0, exemptions: 0 };
  });
  
  // Reset IP stats
  rateLimitStats.ipStats = {};
  
  // Clear recent events
  rateLimitStats.recentEvents = [];
}

/**
 * Get health status based on rate limiting
 * @returns {Object} Health status
 */
export function getHealthStatus() {
  const stats = getRateLimitStats();
  
  let status = 'healthy';
  let issues = [];
  
  // Check if rate limit percentage is too high
  if (stats.summary.rateLimitPercentage > 10) {
    status = 'warning';
    issues.push(`High rate limit events: ${stats.summary.rateLimitPercentage}%`);
  }
  
  if (stats.summary.rateLimitPercentage > 25) {
    status = 'critical';
  }
  
  // Check for suspicious IPs
  const suspiciousIPs = stats.topIPs.filter(ip => 
    ip.rateLimits > 10 && ip.rateLimits / ip.requests > 0.1
  );
  
  if (suspiciousIPs.length > 0) {
    if (status === 'healthy') status = 'warning';
    issues.push(`${suspiciousIPs.length} IPs with high rate limit ratio`);
  }
  
  return {
    status,
    issues,
    recommendations: generateRecommendations(stats)
  };
}

/**
 * Generate recommendations based on current stats
 * @param {Object} stats - Current rate limiting stats
 * @returns {Array} Array of recommendations
 */
function generateRecommendations(stats) {
  const recommendations = [];
  
  if (stats.summary.rateLimitPercentage > 5) {
    recommendations.push('Consider increasing rate limits or investigating traffic patterns');
  }
  
  if (stats.summary.exemptionPercentage < 90 && stats.serviceCallsStats['unknown-service'].requests > 0) {
    recommendations.push('Some service-to-service calls may not be properly authenticated');
  }
  
  if (stats.topIPs.some(ip => ip.rateLimits > 50)) {
    recommendations.push('Consider implementing IP-based blocking for abusive clients');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Rate limiting is working optimally');
  }
  
  return recommendations;
}

/**
 * Normalize endpoint path for tracking
 * @param {string} endpoint - Raw endpoint path
 * @returns {string} Normalized endpoint
 */
function normalizeEndpoint(endpoint) {
  // Remove query parameters and normalize common patterns
  const path = endpoint.split('?')[0];
  
  // Common endpoint patterns
  if (path.startsWith('/courses/batch')) return '/courses/batch';
  if (path.startsWith('/admin/courses')) return '/admin/courses';
  if (path.startsWith('/courses')) return '/courses';
  if (path.startsWith('/sessions')) return '/sessions';
  
  return path;
}

/**
 * Get service source from headers
 * @param {Object} headers - Request headers
 * @returns {string} Service source identifier
 */
export function identifyServiceSource(headers) {
  const userAgent = headers['user-agent'] || '';
  const xForwardedFor = headers['x-forwarded-for'] || '';
  
  // Try to identify service based on patterns
  if (userAgent.includes('package-service') || xForwardedFor.includes('package')) {
    return 'package-service';
  }
  
  if (userAgent.includes('payment-service') || xForwardedFor.includes('payment')) {
    return 'payment-service';
  }
  
  if (userAgent.includes('api-gateway') || xForwardedFor.includes('gateway')) {
    return 'api-gateway';
  }
  
  return 'unknown-service';
}
