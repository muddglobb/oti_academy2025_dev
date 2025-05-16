/**
 * Simple circuit breaker implementation for handling service failures gracefully
 */
export class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeout = options.resetTimeout || 30000; // 30 seconds by default
    this.fallbackFn = options.fallbackFn || null;
    
    this.failures = 0;
    this.state = 'CLOSED'; // 'CLOSED', 'OPEN', or 'HALF_OPEN'
    this.lastFailureTime = null;
    this.successesInHalfOpen = 0;
    this.requiredSuccessesToClose = options.requiredSuccessesToClose || 2;
  }

  /**
   * Execute a function with circuit breaker protection
   * @param {Function} fn - The function to execute
   * @returns {Promise<any>} - The result of the function or fallback
   */
  async execute(fn) {
    try {
      // If circuit is open, check if it's time to try again
      if (this.state === 'OPEN') {
        if (!this.lastFailureTime || Date.now() - this.lastFailureTime >= this.resetTimeout) {
          console.log('Circuit transitioning from OPEN to HALF_OPEN');
          this.state = 'HALF_OPEN';
          this.successesInHalfOpen = 0;
        } else {
          // Circuit still open, use fallback
          console.log('Circuit OPEN - Using fallback');
          return this.fallbackFn ? this.fallbackFn() : null;
        }
      }

      // Execute the function
      const result = await fn();

      // If we're in half-open state and succeeded, track progress toward closed
      if (this.state === 'HALF_OPEN') {
        this.successesInHalfOpen++;
        if (this.successesInHalfOpen >= this.requiredSuccessesToClose) {
          console.log('Circuit transitioning from HALF_OPEN to CLOSED');
          this.state = 'CLOSED';
          this.failures = 0;
        }
      } else if (this.state === 'CLOSED') {
        // Reset failures on success in closed state
        this.failures = 0;
      }

      return result;
    } catch (error) {
      // Track failure
      this.failures++;
      this.lastFailureTime = Date.now();

      // Check if we should open the circuit
      if (this.state === 'CLOSED' && this.failures >= this.failureThreshold) {
        console.log(`Circuit transitioning from CLOSED to OPEN after ${this.failures} failures`);
        this.state = 'OPEN';
      } else if (this.state === 'HALF_OPEN') {
        console.log('Circuit transitioning from HALF_OPEN back to OPEN due to failure');
        this.state = 'OPEN';
      }

      // If circuit is now open or we have a fallback, use the fallback
      if (this.state === 'OPEN' && this.fallbackFn) {
        console.log(`Using fallback due to error: ${error.message}`);
        return this.fallbackFn();
      }

      // Otherwise, propagate the error
      throw error;
    }
  }

  /**
   * Get the current state of the circuit breaker
   * @returns {string} - 'CLOSED', 'OPEN', or 'HALF_OPEN'
   */
  getState() {
    return this.state;
  }

  /**
   * Reset the circuit breaker to closed state
   */
  reset() {
    this.failures = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
    this.successesInHalfOpen = 0;
  }
}
