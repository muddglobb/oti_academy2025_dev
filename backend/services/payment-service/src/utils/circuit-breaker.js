/**
 * Circuit Breaker and Rate Limiting Utilities
 * Helps protect against cascading failures when a service is unavailable or rate limited
 */
import { CACHE_CONFIG } from '../config/cache.config.js';
import { recordRateLimitEvent } from './cache-monitor.js';

// Circuit breaker state (shared across service)
const circuitState = {
  // For each service circuit breaker
  package: {
    state: 'CLOSED', // CLOSED (normal), OPEN (failing), HALF_OPEN (testing)
    failures: 0,
    lastFailure: 0,
    successesInHalfOpen: 0
  },
  course: {
    state: 'CLOSED',
    failures: 0,
    lastFailure: 0,
    successesInHalfOpen: 0
  },
  enrollment: {
    state: 'CLOSED',
    failures: 0,
    lastFailure: 0,
    successesInHalfOpen: 0
  }
};

// Rate limiting detection for each service
const rateLimitState = {
  package: {
    consecutiveRateLimits: 0,
    backoffUntil: 0
  },
  course: {
    consecutiveRateLimits: 0,
    backoffUntil: 0
  },
  enrollment: {
    consecutiveRateLimits: 0,
    backoffUntil: 0
  }
};

/**
 * Execute a function with circuit breaker protection
 * @param {string} service - Service name (package, course, enrollment)
 * @param {Function} fn - Function to execute
 * @returns {Promise<any>} - Result of the function
 * @throws {Error} - If circuit is open or function fails
 */
export async function executeWithCircuitBreaker(service, fn) {
  const circuit = circuitState[service];
  if (!circuit) {
    console.warn(`No circuit breaker defined for service: ${service}`);
    return fn();
  }

  // Check if circuit is open
  if (circuit.state === 'OPEN') {
    const now = Date.now();
    const resetTimeout = CACHE_CONFIG.circuitBreaker.resetTimeoutMs;
    
    if (now - circuit.lastFailure < resetTimeout) {
      throw new Error(`Circuit for ${service} is OPEN. Service unavailable.`);
    }
    
    // Transition to half-open after timeout
    console.log(`Circuit for ${service} transitioning to HALF-OPEN state`);
    circuit.state = 'HALF_OPEN';
    circuit.successesInHalfOpen = 0;
  }
  
  try {
    // Check for rate limiting backoff
    await checkRateLimitBackoff(service);
    
    // Execute the function
    const result = await fn();
    
    // Handle success
    if (circuit.state === 'HALF_OPEN') {
      circuit.successesInHalfOpen++;
      
      // If enough successes in half-open state, close the circuit
      if (circuit.successesInHalfOpen >= CACHE_CONFIG.circuitBreaker.halfOpenSuccess) {
        console.log(`Circuit for ${service} closed after successful recovery`);
        circuit.state = 'CLOSED';
        circuit.failures = 0;
      }
    } else if (circuit.state === 'CLOSED') {
      // Reset failures after successful call in closed state
      circuit.failures = 0;
    }
    
    return result;
  } catch (error) {
    // Handle failure
    handleCircuitFailure(service, error);
    throw error;
  }
}

/**
 * Handle a circuit failure
 * @param {string} service - Service name
 * @param {Error} error - Error that occurred
 */
function handleCircuitFailure(service, error) {
  const circuit = circuitState[service];
  if (!circuit) return;
  
  // Check for rate limiting
  if (error.response && error.response.status === 429) {
    handleRateLimit(service, error);
  }
  
  circuit.failures++;
  circuit.lastFailure = Date.now();
  
  // If too many failures, open the circuit
  if (circuit.failures >= CACHE_CONFIG.circuitBreaker.failureThreshold) {
    if (circuit.state !== 'OPEN') {
      console.warn(`Circuit for ${service} OPENED after ${circuit.failures} failures`);
      circuit.state = 'OPEN';
    }
  }
}

/**
 * Handle a rate limit response
 * @param {string} service - Service name
 * @param {Error} error - Error that occurred
 */
function handleRateLimit(service, error) {
  const state = rateLimitState[service];
  if (!state) return;
  
  state.consecutiveRateLimits++;
  recordRateLimitEvent();
  
  // Get retry-after from response header or use exponential backoff
  let retryAfter = 60; // Default 60 seconds
  
  if (error.response && error.response.headers && error.response.headers['retry-after']) {
    retryAfter = parseInt(error.response.headers['retry-after'], 10);
  } else {
    // Exponential backoff with jitter
    const base = Math.min(30, Math.pow(2, state.consecutiveRateLimits));
    retryAfter = base * (0.8 + Math.random() * 0.4);
  }
  
  // Set backoff time
  const backoffMs = retryAfter * 1000;
  state.backoffUntil = Date.now() + backoffMs;
  
  console.warn(`Rate limit hit for ${service}. Backing off for ${retryAfter} seconds.`);
}

/**
 * Check if we're in a rate limit backoff period
 * @param {string} service - Service name
 * @returns {Promise<void>}
 */
async function checkRateLimitBackoff(service) {
  const state = rateLimitState[service];
  if (!state) return;
  
  const now = Date.now();
  if (now < state.backoffUntil) {
    const waitTime = state.backoffUntil - now;
    console.log(`Waiting ${Math.round(waitTime/1000)}s for rate limit backoff for ${service}`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  } else if (state.consecutiveRateLimits > 0) {
    // Reset consecutive rate limits if we're past the backoff period
    state.consecutiveRateLimits = 0;
  }
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelayMs - Initial delay in milliseconds
 * @returns {Promise<any>} - Result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, initialDelayMs = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors (except 429)
      if (error.response && 
          error.response.status >= 400 && 
          error.response.status < 500 &&
          error.response.status !== 429) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        // Calculate delay with exponential backoff and jitter
        const delay = initialDelayMs * Math.pow(2, attempt - 1) * (0.8 + Math.random() * 0.4);
        console.warn(`Retry attempt ${attempt}/${maxRetries} failed. Retrying in ${Math.round(delay)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
