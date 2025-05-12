import jwt from 'jsonwebtoken';

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
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. No token provided.'
    });
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request - normalize ID field
    req.user = {
      id: decoded.id || decoded.userId || decoded.sub,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
    
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};
