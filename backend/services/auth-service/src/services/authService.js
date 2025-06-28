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
    const { name, email, password, type, nim, phone} = userData;

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

    if (phone) {
      let normalizedPhone = phone;
      if (phone.startsWith('+62')) {
        normalizedPhone = '0' + phone.substring(3);
      } else if (phone.startsWith('62')) {
        normalizedPhone = '0' + phone.substring(2);
      }
    
      // Check if phone number already exists for another user
      const existingUserWithPhone = await prisma.user.findFirst({
        where: {
          phone: normalizedPhone,
        }})
      
      if (existingUserWithPhone) {
        throw new Error('Nomor HP sudah digunakan oleh user lain');
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
        phone: phone ? (phone.startsWith('+62') ? '0' + phone.substring(3) : phone.startsWith('62') ? '0' + phone.substring(2) : phone) : null,
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
        phone: user.phone,
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
        phone: user.phone,
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
        phone: true,
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
   * Update user phone number
   * @param {string} userId - User ID
   * @param {string} phone - Phone number (already validated by middleware)
   * @returns {Object} Updated user
   */
  async updateUserPhone(userId, phone) {
    // Normalize phone number (middleware sudah validate format)
    let normalizedPhone = phone;
    if (phone.startsWith('+62')) {
      normalizedPhone = '0' + phone.substring(3);
    } else if (phone.startsWith('62')) {
      normalizedPhone = '0' + phone.substring(2);
    }

    // Check if phone number already exists for another user
    const existingUser = await prisma.user.findFirst({
      where: {
        phone: normalizedPhone,
        id: { not: userId }
      }
    });

    if (existingUser) {
      throw new Error('Nomor HP sudah digunakan oleh user lain');
    }

    // Update user phone
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { phone: normalizedPhone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        type: true,
        nim: true
      }
    });

    return updatedUser;
  }

    /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Object} User profile
   */
  async getUserProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        type: true,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user profile (name and/or phone)
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update (already validated by middleware)
   * @returns {Object} Updated user
   */
  async updateUserProfile(userId, updateData) {
    const { name, phone } = updateData;
    
    const updateFields = {};
    
    if (name) updateFields.name = name;
    
    if (phone) {
      // Normalize phone to start with 0
      let normalizedPhone = phone;
      if (phone.startsWith('+62')) {
        normalizedPhone = '0' + phone.substring(3);
      } else if (phone.startsWith('62')) {
        normalizedPhone = '0' + phone.substring(2);
      }

      // Check uniqueness
      const existingUser = await prisma.user.findFirst({
        where: {
          phone: normalizedPhone,
          id: { not: userId }
        }
      });

      if (existingUser) {
        throw new Error('Nomor HP sudah digunakan oleh user lain');
      }

      updateFields.phone = normalizedPhone;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateFields,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        type: true
      }
    });

    return updatedUser;
  }

}

export default new AuthService();