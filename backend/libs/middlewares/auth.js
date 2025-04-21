import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/api-response.js';

const prisma = new PrismaClient();

/**
 * Middleware to validate JWT tokens and set authenticated user in request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
export const authenticate = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  // Check if auth header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      ApiResponse.error('Authentication required. No token provided.')
    );
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Check if token is blacklisted
    const blacklistedToken = await prisma.tokenBlacklist.findUnique({
      where: { token }
    }).catch(() => null); // Handle case where table doesn't exist
    
    if (blacklistedToken) {
      return res.status(401).json(
        ApiResponse.error('Token has been revoked')
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request - normalize ID field
    req.user = {
      id: decoded.id || decoded.userId || decoded.sub,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json(
      ApiResponse.error('Invalid or expired token')
    );
  }
};