import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

/**
 * Authentication service handles user authentication and token management
 */
class AuthService {
  /**
   * Generate both access token and refresh token for a user
   * @param {Object} user - User object with id and role
   * @returns {Object} Object containing accessToken and refreshToken
   */
  generateTokens(user) {
    // Include userId and role in the JWT payload
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Generate a secure random refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');

    return { accessToken, refreshToken };
  }

  /**
   * Generate secure cookie options for HTTP-only cookies
   * @param {string} tokenType - Type of token ('access' or 'refresh')
   * @returns {Object} Cookie options
   */
getCookieOptions(tokenType) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log(`Cookie options requested for ${tokenType} token`);
  
  // Base options for all cookies
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  };
  
  // Add domain if configured in environment
  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
    console.log(`Setting domain: ${options.domain}`);
  }
  
  // Add expiration based on token type
  if (tokenType === 'refresh') {
    options.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    console.log(`Refresh token maxAge: ${options.maxAge}ms`);
  } else {
    options.maxAge = parseInt(process.env.JWT_EXPIRES_IN_MS || '3600000'); // Default to 1 hour
    console.log(`Access token maxAge: ${options.maxAge}ms`);
  }
  
  return options;
}

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} User object and auth tokens
   */
  async register(userData) {
    const { name, email, password, type, nim } = userData;

    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      throw new Error('Email already registered');
    }

    if(type === 'DIKE' && nim){
      const existingUserWithNim = await prisma.user.findFirst({
        where: { nim }
      });

      if (existingUserWithNim) {
        throw new Error('NIM already registered by anouther account, if you are the owner of this account, please contact the admin to recover your account');
      }
    }

    // Determine role based on user type
    let role;
    if (type === 'DIKE') role = 'DIKE';
    else if (type === 'UMUM') role = 'UMUM';
    else role = 'USER';
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with determined role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        type,
        nim: type === 'DIKE' ? nim : null,
        role,  
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: user.type,
      },
      accessToken,
      refreshToken,
    };
  }
  /**
   * Authenticate a user by email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User object and auth tokens
   */
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // **PERBAIKAN: Hapus semua refresh token lama untuk user ini sebelum membuat yang baru**
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id }
    });

    // Generate tokens with role included
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: user.type,
      },
      accessToken,
      refreshToken,
    };
  }
  /**
   * Refresh access token using a valid refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} New access token and refresh token
   */
  async refreshAccessToken(refreshToken) {
    // Find valid refresh token
    const storedRefreshToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true
      }
    });

    if (!storedRefreshToken) {
      throw new Error('Invalid or expired refresh token');
    }

    // **PERBAIKAN: Implementasi refresh token rotation - hapus token lama**
    await prisma.refreshToken.delete({
      where: { id: storedRefreshToken.id }
    });

    // Generate new tokens (both access and refresh for rotation)
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(storedRefreshToken.user);

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedRefreshToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { 
      accessToken,
      refreshToken: newRefreshToken 
    };
  }
    /**
   * Logout a user by invalidating their refresh token
   * @param {string} refreshToken - Refresh token to invalidate
   * @param {string} accessToken - Optional access token to blacklist
   * @returns {boolean} Success status
   */
  async logout(refreshToken, accessToken = null) {
    let userId = null;

    // **PERBAIKAN: Dapatkan userId dari refresh token untuk menghapus semua token user**
    if (refreshToken) {
      const storedRefreshToken = await prisma.refreshToken.findFirst({
        where: { token: refreshToken },
        select: { userId: true }
      });
      
      if (storedRefreshToken) {
        userId = storedRefreshToken.userId;
      }
    }

    // **PERBAIKAN: Hapus SEMUA refresh token untuk user ini, bukan hanya satu**
    if (userId) {
      await prisma.refreshToken.deleteMany({
        where: { userId }
      });
    } else if (refreshToken) {
      // Fallback: hapus hanya token yang diberikan jika userId tidak ditemukan
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });
    }
    
    // Optionally blacklist the access token
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        
        await prisma.tokenBlacklist.create({
          data: {
            token: accessToken,
            expiresAt: new Date(decoded.exp * 1000)
          }
        });
      } catch (error) {
        // Token already expired, no need to blacklist
        console.log('Access token already expired or invalid');
      }
    }
    
    return true;
  }
  /**
   * Update user role
   * @param {number} userId - User ID to update
   * @param {string} newRole - New role (ADMIN, DIKE, UMUM, USER)
   * @returns {Object} Updated user
   */
  async updateUserRole(userId, newRole) {
    // Validate that newRole is one of the valid roles
    const validRoles = ['ADMIN', 'DIKE', 'UMUM', 'USER'];
    
    if (!validRoles.includes(newRole)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }
    
    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        type: true,
        nim: true
      }
    });
    
    return updatedUser;
  }

  /**
   * Clean up expired refresh tokens
   * @returns {number} Number of tokens cleaned up
   */
  async cleanupExpiredTokens() {
    try {
      const result = await prisma.refreshToken.deleteMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });
      
      console.log(`🧹 Cleaned up ${result.count} expired refresh tokens`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
      return 0;
    }
  }

  /**
   * Clean up expired blacklisted tokens
   * @returns {number} Number of tokens cleaned up
   */
  async cleanupExpiredBlacklistedTokens() {
    try {
      const result = await prisma.tokenBlacklist.deleteMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });
      
      console.log(`🧹 Cleaned up ${result.count} expired blacklisted tokens`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired blacklisted tokens:', error);
      return 0;
    }
  }
}

export default new AuthService();