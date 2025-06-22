import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import { asyncHandler } from '../middleware/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';
import authService from '../services/authService.js';

const prisma = new PrismaClient();

// @desc    Register user
// @route   POST /register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, type, nim, phone } = req.body;
  
  try {
    const result = await authService.register({ name, email, password, type, nim, phone });
    
    // Set HTTP-only cookies for both tokens
    res.cookie('access_token', result.accessToken, authService.getCookieOptions('access'));
    res.cookie('refresh_token', result.refreshToken, authService.getCookieOptions('refresh'));
    
    
    res.status(201).json(
      ApiResponse.success({ user: result.user }, 'User registered successfully')
    );
  } catch (error) {
    res.status(400).json(
      ApiResponse.error(error.message)
    );
  }
});

// @desc    Login user
// @route   POST /login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await authService.login(email, password);
    
    // Add debug logging
    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'DEVELOPMENT') {
    console.log('Setting access_token cookie with options:', authService.getCookieOptions('access'));
    console.log('Setting refresh_token cookie with options:', authService.getCookieOptions('refresh'));
    }
    
    // Set cookies in explicit order with explicit options
    const accessOptions = authService.getCookieOptions('access');
    const refreshOptions = authService.getCookieOptions('refresh');
    
    // IMPORTANT: Use consistent cookie names throughout the application
    res.cookie('access_token', result.accessToken, accessOptions);
    res.cookie('refresh_token', result.refreshToken, refreshOptions);
    
    // Return response after cookies are set
    return res.status(200).json(
      ApiResponse.success(
        { user: result.user }, 'Logged in successfully')
    );
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
});

// @desc    Logout User
// @route   POST /logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // Get token from cookie or body
  const refreshToken = req.cookies?.refresh_token || req.body.refreshToken;
  const accessToken = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];
  
  try {
    // **PERBAIKAN: Logout bahkan jika tidak ada refresh token**
    if (refreshToken || accessToken) {
      await authService.logout(refreshToken, accessToken);
    }
    
    // **PERBAIKAN: Clear cookies dengan opsi yang lebih eksplisit**
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };
    
    // Add domain if configured
    if (process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }
    
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    
    res.status(200).json(
      ApiResponse.success(null, 'Logged out successfully')
    );
  } catch (error) {
    // **PERBAIKAN: Clear cookies even if logout fails**
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };
    
    if (process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }
    
    res.clearCookie('access_token', cookieOptions);    res.clearCookie('refresh_token', cookieOptions);
    
    // Still return success even if logout fails (user experience)
    res.status(200).json(
      ApiResponse.success(null, 'Logged out successfully')
    );
  }
});

// @desc    Refresh access token
// @route   POST /refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  // Get token from cookie or body
  const refreshToken = req.cookies?.refresh_token || req.body.refreshToken;
  
  if (!refreshToken) {
    return res.status(400).json(
      ApiResponse.error('Refresh token is required')
    );
  }
  
  try {
    const result = await authService.refreshAccessToken(refreshToken);
    
    // **PERBAIKAN: Set kedua token karena menggunakan refresh token rotation**
    res.cookie('access_token', result.accessToken, authService.getCookieOptions('access'));
    res.cookie('refresh_token', result.refreshToken, authService.getCookieOptions('refresh'));
    
    res.status(200).json(
      ApiResponse.success({
        accessToken: result.accessToken, // Include for backwards compatibility
        refreshToken: result.refreshToken // Include new refresh token
      }, 'Token refreshed successfully')
    );
  } catch (error) {
    res.status(401).json(
      ApiResponse.error(error.message)
    );
  }
});

// @desc    Forgot password
// @route   POST /forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  
  // Always return success even if user not found (security)
  if (!user) {
    console.info(`Reset password attempted for non-existent email: ${email}`);
    return res.status(200).json(
      ApiResponse.success('If your email is registered, you will receive reset instructions shortly')
    );
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Delete any existing tokens for this user
  await prisma.passwordReset.deleteMany({
    where: { email: user.email }
  });
  
  // Store token in database
  await prisma.passwordReset.create({
    data: {
      email: user.email,
      token: resetTokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  // Try to send email but don't fail if email service is down
  try {
    if (process.env.EMAIL_SERVICE_URL) {
      // Get the email service URL
      const emailServiceUrl = process.env.EMAIL_SERVICE_URL;
      const serviceApiKey = process.env.SERVICE_API_KEY || 'default-api-key';
        // Call our new email service
      await axios.post(`${emailServiceUrl}/email/password-reset`, {
        email: user.email,
        resetLink: resetUrl,
        username: user.name || user.email.split('@')[0]
      }, {
        headers: {
          'x-api-key': serviceApiKey,
          'Content-Type': 'application/json'
        }
      });
      
      console.info(`Reset password email sent to: ${email}`);
    }
  } catch (emailError) {
    // Log error but don't expose to user
    console.error(`Failed to send reset password email: ${emailError.message}`);
  }
  
  // For development, log more details and provide fallback
  if (process.env.NODE_ENV === 'development') {
    console.log('==== DEVELOPMENT ONLY - NOT FOR PRODUCTION ====');
    console.log(`Password reset URL for ${email}:`);
    console.log(resetUrl);
    console.log(`Raw reset token: ${resetToken}`);
    console.log('=================================================');
  }

  return res.status(200).json(
    ApiResponse.success('If your email is registered, you will receive reset instructions shortly')
  );
});

// @desc    Reset password
// @route   POST /reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Hash the token to compare with the stored hash
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Find valid token
  const passwordReset = await prisma.passwordReset.findFirst({
    where: {
      token: resetTokenHash,
      expiresAt: { gt: new Date() },
    },
  });

  if (!passwordReset) {
    return res.status(400).json(
      ApiResponse.error('Invalid or expired password reset token')
    );
  }

  // Update user password
  const user = await prisma.user.findUnique({ where: { email: passwordReset.email } });
  if (!user) {
    return res.status(404).json(
      ApiResponse.error('User not found')
    );
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update user password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  // Delete all password reset tokens for this user
  await prisma.passwordReset.deleteMany({
    where: { email: user.email },
  });

  res.status(200).json(
    ApiResponse.success('Password has been reset successfully')
  );
});

// @desc    Verify reset token validity
// @route   GET /verify-reset/:token
// @access  Public
export const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;
  
  // Hash token
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Find valid token
  const passwordReset = await prisma.passwordReset.findFirst({
    where: {
      token: resetTokenHash,
      expiresAt: { gt: new Date() },
    },
  });

  if (!passwordReset) {
    return res.status(400).json(
      ApiResponse.error('Invalid or expired password reset token')
    );
  }

  // Return success with email (masked for security if needed)
  const email = passwordReset.email;
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1****$3');
  
  res.status(200).json(
    ApiResponse.success({
      valid: true,
      email: maskedEmail
    })
  );
});

// @desc    Change password
// @route   PATCH /change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    return res.status(404).json(
      ApiResponse.error('User not found')
    );
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(
      ApiResponse.error('Current password is incorrect')
    );
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.status(200).json(
    ApiResponse.success('Password updated successfully')
  );
});

// @desc    Update user profile
// @route   PATCH /update-profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body; // Tambah phone

  try {
    const result = await authService.updateUserProfile(req.user.id, { name, phone });
    
    res.status(200).json(
      ApiResponse.success(result, 'Profile updated successfully')
    );
  } catch (error) {
    res.status(400).json(
      ApiResponse.error(error.message)
    );
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      type: true,
      nim: true,
      createdAt: true,
    }, 
    orderBy: {
      createdAt: 'desc',
    }
  });

    res.status(200).json(
      ApiResponse.success(users)
    );
  });

export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if(req.user.id !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SERVICE') {
    return res.status(403).json(
      ApiResponse.error('Not authorized to access this user profile')
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true, 
      phone: true,
      role: true,
      type: true,
      nim: true,
      createdAt: true
    }
  });

  if(!user){
    return res.status(404).json(
      ApiResponse.error('User not found')
    );
  }

  res.status(200).json(
    ApiResponse.success(user)
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return res.status(404).json(
      ApiResponse.error('User not found')
    );
  }

  await prisma.refreshToken.deleteMany({
    where: { userId }
  });

  // Delete user
  await prisma.user.delete({
    where: { id: userId }
  });

  res.status(200).json(
    ApiResponse.success(null, 'User deleted successfully')
  );
});

// @desc    Get current user profile
// @route   GET /profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    
    res.status(200).json(
      ApiResponse.success(user)
    );
  } catch (error) {
    res.status(404).json(
      ApiResponse.error(error.message)
    );
  }
});

export const validateToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json(
        ApiResponse.error('Invalid token')
      );
    }

    res.status(200).json(
      ApiResponse.success(decoded, 'Token is valid')
    );
  });
});