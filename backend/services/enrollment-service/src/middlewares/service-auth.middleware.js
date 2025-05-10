import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/api-response.js';
/**
 * Middleware untuk memverifikasi token dari service lain
 * Digunakan untuk komunikasi service-to-service
 */
export const verifyServiceToken = (req, res, next) => {
  try {
    // Check if service API key exists in header
    const apiKey = req.headers['x-service-api-key'];
    
    if (!apiKey) {
      return res.status(401).json(
        ApiResponse.error('Service API key required')
      );
    }

    // Verify the API key matches the one in env
    if (apiKey !== process.env.SERVICE_API_KEY) {
      return res.status(401).json(
        ApiResponse.error('Invalid service API key')
      );
    }

    // Additionally, try to extract user info from JWT if it exists
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id || decoded.sub,
          role: decoded.role || 'SERVICE'
        };
      } catch (jwtError) {
        // Ignore JWT errors for service-to-service calls
        console.warn('Warning: Invalid JWT token in service-to-service call:', jwtError.message);
      }
    }

    // Also check for explicit user ID header
    if (req.headers['x-user-id'] && !req.user) {
      req.user = {
        id: req.headers['x-user-id'],
        role: 'SERVICE'
      };
    }

    next();
  } catch (error) {
    console.error('Service authentication error:', error);
    return res.status(401).json(
      ApiResponse.error('Service authentication failed')
    );
  }
};

export default verifyServiceToken;
