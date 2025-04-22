import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
   * @returns {Object} New access token
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

    // Generate new access token with role
    const accessToken = jwt.sign(
      { 
        id: storedRefreshToken.user.id,
        role: storedRefreshToken.user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { accessToken };
  }
  
  /**
   * Logout a user by invalidating their refresh token
   * @param {string} refreshToken - Refresh token to invalidate
   * @param {string} accessToken - Optional access token to blacklist
   * @returns {boolean} Success status
   */
  async logout(refreshToken, accessToken = null) {
    // Remove refresh token from database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });
    
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
}

export default new AuthService();