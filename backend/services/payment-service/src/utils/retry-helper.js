/**
 * Utility for retrying operations with exponential backoff
 */

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise<any>} - Result of the function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Identify network/DNS issues and log them specially
      const isDnsError = error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED';
      
      if (isDnsError) {
        console.error(`⚠️ Network/DNS resolution error on attempt ${attempt}: ${error.message}`);
        // For DNS issues, wait a bit longer before retry to let DNS resolve
        if (attempt < maxRetries) {
          const dnsDelay = initialDelay * Math.pow(2, attempt);
          console.log(`DNS issue detected, waiting longer: ${dnsDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, dnsDelay));
          continue;
        }
      } else {
        console.log(`Attempt ${attempt} failed, ${attempt < maxRetries ? 'retrying' : 'giving up'}:`, error.message);
        
        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt - 1);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }
  
  throw lastError;
};

/**
 * Circuit breaker pattern implementation
 */
export class CircuitBreaker {
  constructor(name) {
    this.name = name;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.successThreshold = 2;
    this.failureThreshold = 3;
    this.resetTimeout = 30000; // 30 seconds
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.lastFailureTime + this.resetTimeout) {
        this.state = 'HALF_OPEN';
        console.log(`Circuit breaker for ${this.name} is half open`);
      } else {
        throw new Error(`Circuit for ${this.name} is open`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.reset();
      }
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if ((this.state === 'CLOSED' && this.failureCount >= this.failureThreshold) || 
        this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      console.log(`Circuit breaker for ${this.name} is now open`);
    }
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    console.log(`Circuit breaker for ${this.name} has been reset`);
  }
}

// Initialize circuit breakers for different services
const circuitBreakers = {
  enrollment: new CircuitBreaker('enrollment-service'),
  email: new CircuitBreaker('email-service'),
  auth: new CircuitBreaker('auth-service'),
  package: new CircuitBreaker('package-service')
};

/**
 * Execute a function with circuit breaker pattern
 * @param {string} serviceName - Name of the service
 * @param {Function} fn - The function to execute
 * @returns {Promise<any>} - Result of the function
 */
export const executeWithCircuitBreaker = async (serviceName, fn) => {
  // Make sure we have a circuit breaker for this service
  if (!circuitBreakers[serviceName]) {
    circuitBreakers[serviceName] = new CircuitBreaker(serviceName);
  }
  
  const breaker = circuitBreakers[serviceName];
  
  try {
    console.log(`Executing operation on ${serviceName} with circuit breaker (state: ${breaker.state})`);
    return await breaker.execute(fn);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(`⚠️ Network/DNS resolution error when connecting to ${serviceName}: ${error.message}`);
      
      // Force circuit breaker to open on DNS issues to prevent cascading failures
      if (breaker.state !== 'OPEN') {
        breaker.failureCount = breaker.failureThreshold;
        breaker.onFailure();
        console.error(`Circuit breaker for ${serviceName} forced open due to DNS/connection issues`);
      }
    }
    throw error;
  }
};
