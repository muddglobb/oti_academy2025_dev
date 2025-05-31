import axios from 'axios';
import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import path from 'path';
import fs from 'fs';

// Simple logger functions
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`),
  debug: (message) => console.log(`[DEBUG] ${message}`)
};

// Simple circuit breaker implementation
const circuitBreakers = {};

class CircuitBreaker {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.failureThreshold = 5;
    this.resetTimeout = 30000; // 30 seconds
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      logger.error(`Circuit breaker for ${this.serviceName} is now OPEN`);
    }
  }

  canRequest() {
    if (this.state === 'CLOSED') {
      return true;
    }
    
    // Check if it's time to try again
    if (this.state === 'OPEN' && 
        Date.now() - this.lastFailureTime > this.resetTimeout) {
      this.state = 'HALF-OPEN';
      logger.info(`Circuit breaker for ${this.serviceName} is now HALF-OPEN`);
      return true;
    }
    
    return this.state === 'HALF-OPEN';
  }
}

// Configure upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'temp-uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Export multer middleware for file uploads
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Sanitize request body for logging
const sanitizeRequestBody = (body) => {
  if (!body) return {};
  
  const sanitized = { ...body };
  
  if (sanitized.password) sanitized.password = '***HIDDEN***';
  if (sanitized.currentPassword) sanitized.currentPassword = '***HIDDEN***';
  if (sanitized.newPassword) sanitized.newPassword = '***HIDDEN***';
  
  return sanitized;
};

/**
 * Create a direct handler for routing to microservices
 */
export const createDirectHandler = (serviceUrl, servicePath, requiresAuth = true, isOptionalAuth = false, authMiddleware) => {
  // Default middleware that just passes the request
  const defaultMiddleware = (req, res, next) => next();
  
  // Determine which middleware to use
  const middleware = requiresAuth ? 
    (authMiddleware || defaultMiddleware) : 
    defaultMiddleware;
  
  // Validate service URL with fallback
  const baseUrl = serviceUrl || 'http://auth-service-api:8001';
  
  // Log service URL for debugging
  logger.info(`Creating handler for service: ${baseUrl}, path: ${servicePath}`);
    const subRouter = express.Router();
  
  // Rate limiting is now handled at route level, not here
  // subRouter.use(standardLimiter); // REMOVED
  
  // Use a simple handler for all methods and paths
  subRouter.use((req, res, next) => {
    middleware(req, res, async () => {
      try {
        const routeKey = req.baseUrl.split('/')[1]; 
        const basePathPattern = new RegExp(`^/${routeKey}`);
        let relativePath = req.originalUrl.replace(basePathPattern, '');
        
        // Prevent double slashes by ensuring proper path format
        let formattedServicePath = servicePath;
        if (servicePath && !servicePath.startsWith('/')) {
          formattedServicePath = `/${servicePath}`;
        }
        
        // Handle case when both paths have slashes or neither has
        if ((formattedServicePath.endsWith('/') && relativePath.startsWith('/')) ||
            (!formattedServicePath && relativePath.startsWith('/'))) {
          relativePath = relativePath.substring(1);
        }
        
        // Build target URL
        const targetUrl = `${baseUrl}${servicePath}${relativePath}`;
        
        logger.info(`Direct request: ${req.method} ${req.originalUrl} -> ${targetUrl}`);
        
        // Circuit breaker logic
        if (!circuitBreakers[baseUrl]) {
          circuitBreakers[baseUrl] = new CircuitBreaker(baseUrl);
        }
        
        const circuitBreaker = circuitBreakers[baseUrl];
        
        if (!circuitBreaker.canRequest()) {
          logger.error(`Circuit breaker for ${baseUrl} is OPEN. Request blocked.`);
          return res.status(503).json({
            status: 'error',
            message: 'Service temporarily unavailable due to repeated failures'
          });
        }
        
        // Check if this is a multipart request with file
        const isMultipart = req.headers['content-type'] && 
                            req.headers['content-type'].includes('multipart/form-data');
        
        if (isMultipart && req.file) {
          // Handle file upload - create form data
          const formData = new FormData();
          
          // Sanitize file path to prevent path traversal vulnerabilities
          const safeFilePath = path.resolve(req.file.path);
          const allowedDir = path.join(process.cwd(), 'temp-uploads');
          if (!safeFilePath.startsWith(allowedDir)) {
            throw new Error('Invalid file path');
          }
            // Add file
          formData.append('file', fs.createReadStream(safeFilePath), {
            filename: req.file.originalname,
            contentType: req.file.mimetype
          });
          
          // Add other form fields
          Object.keys(req.body).forEach(key => {
            formData.append(key, req.body[key]);
          });
          
          // Set headers with form data boundaries and API Gateway identifier
          const headers = {
            ...formData.getHeaders(),
            'X-API-Gateway': 'true',
            'X-Service-Key': process.env.SERVICE_API_KEY || 'gateway-internal',
            ...(req.headers.authorization ? { 'Authorization': req.headers.authorization } : {}),
            ...(req.user ? { 'X-User-ID': req.user.id, 'X-User-Role': req.user.role } : {})
          };
          
          // Send request with form data
          const response = await axios.post(targetUrl, formData, { 
            headers: headers,
            timeout: 30000 // 30 seconds for file uploads
          });
          
          // Clean up temp file with path validation
          const safeUnlinkPath = path.resolve(req.file.path);
          const allowedUnlinkDir = path.join(process.cwd(), 'temp-uploads');
          if (safeUnlinkPath.startsWith(allowedUnlinkDir)) {
            fs.unlink(safeUnlinkPath, (err) => {
              if (err) logger.error(`Error deleting temp file: ${err.message}`);
            });
          } else {
            logger.error('Attempted to delete file outside of allowed directory');
          }
          
          circuitBreaker.recordSuccess();
          logger.info(`Response from ${baseUrl}: ${response.status}`);

          // Handle cookies properly - Forward any Set-Cookie headers
          if (response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
            logger.debug(`Forwarding cookies: ${response.headers['set-cookie'].length} cookies found`);
          }

          return res.status(response.status).json(response.data);
        } else {
          // Regular JSON request
          const sanitizedBody = sanitizeRequestBody(req.body);
          logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
            const headers = {
            'Content-Type': req.headers['content-type'] || 'application/json',
            'X-API-Gateway': 'true',
            'X-Service-Key': process.env.SERVICE_API_KEY || 'gateway-internal',
            ...(req.headers.authorization ? { 'Authorization': req.headers.authorization } : {}),
            ...(req.user ? { 'X-User-ID': req.user.id, 'X-User-Role': req.user.role } : {})
          };
          
          const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.method !== 'GET' ? req.body : undefined,
            params: req.query,
            headers,
            timeout: 10000 // 10 seconds timeout
          });
          
          circuitBreaker.recordSuccess();
          logger.info(`Response from ${baseUrl}: ${response.status}`);
          
          // FIXED: Properly handle and forward Set-Cookie headers
          if (response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
            logger.debug(`Forwarding cookies: ${response.headers['set-cookie'].length} cookies found`);
          }
          
          return res.status(response.status).json(response.data);
        }
      } catch (error) {
        logger.error(`Request error: ${error.message}`);
        
        if (error.response) {
          circuitBreakers[baseUrl].recordFailure();
          return res.status(error.response.status).json(error.response.data);
        }
        
        if (error.code === 'ECONNABORTED') {
          logger.error(`Request to ${baseUrl} timed out`);
          circuitBreakers[baseUrl].recordFailure();
          return res.status(504).json({
            status: 'error',
            message: 'Service request timed out',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
          });
        }
        
        circuitBreakers[baseUrl].recordFailure();
        return res.status(503).json({
          status: 'error',
          message: 'Service temporarily unavailable',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });
  });
  
  return subRouter;
};