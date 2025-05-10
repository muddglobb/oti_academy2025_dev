/**
 * Auth Middleware
 * Verifies user authentication token and sets user data on request object
 */
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/api-response.js';

const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        ApiResponse.error('Authentication required. No token provided.')
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the JWT token using the environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request
    req.user = {
      id: decoded.id || decoded.sub,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json(
      ApiResponse.error('Invalid or expired authentication token')
    );
  }
};

export default authMiddleware;
