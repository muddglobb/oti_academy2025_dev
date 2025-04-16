import jwt from 'jsonwebtoken';

/**
 * Middleware untuk validasi JWT
 */
export const jwtValidatorMiddleware = (req, res, next) => {
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
    
    // Set user data in request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Middleware untuk validasi JWT opsional - tidak error jika tidak ada token
 */
export const optionalJwtValidator = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  // Jika tidak ada auth header, lanjutkan tanpa user info
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    // Token tidak valid, tapi tetap lanjutkan tanpa user info
    next();
  }
};