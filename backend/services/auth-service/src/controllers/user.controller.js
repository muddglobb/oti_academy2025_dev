import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import authService from '../services/authService.js';

const prisma = new PrismaClient();

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
    // Change: Remove parseInt to keep the ID as a string for UUID compatibility
    const userId = req.params.id;

    if (req.user.id !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SERVICE') {
        return res.status(403).json(
            ApiResponse.error('Not authorized to access this user profile')
        );
    }    const user = await prisma.user.findUnique({
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

    if (!user) {
        return res.status(404).json(
            ApiResponse.error('User not found')
        );
    }

    res.status(200).json(
        ApiResponse.success(user)
    );
});


export const updateUser = asyncHandler(async (req, res) => {
    // Change: Remove parseInt to keep the ID as a string for UUID compatibility
    const userId = req.params.id;
    const { name, email, phone } = req.body;

    if (req.user.id !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json(
            ApiResponse.error('Not authorized to update this user profile')
        );
    }

    if (email) {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser && existingUser.id !== userId) {
            return res.status(400).json(
                ApiResponse.error('Email already in use')
            );
        }
    }

    // Phone validation jika ada
    if (phone) {
        // Normalize phone
        let normalizedPhone = phone;
        if (phone.startsWith('+62')) {
            normalizedPhone = '0' + phone.substring(3);
        } else if (phone.startsWith('62')) {
            normalizedPhone = '0' + phone.substring(2);
        }

        const existingPhone = await prisma.user.findFirst({
            where: { 
                phone: normalizedPhone,
                id: { not: userId }
            },
        });

        if (existingPhone) {
            return res.status(400).json(
                ApiResponse.error('Phone number already in use')
            );
        }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) {
        // Normalize phone untuk updateData
        let normalizedPhone = phone;
        if (phone.startsWith('+62')) {
            normalizedPhone = '0' + phone.substring(3);
        } else if (phone.startsWith('62')) {
            normalizedPhone = '0' + phone.substring(2);
        }
        updateData.phone = normalizedPhone;
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
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

    res.status(200).json(
        ApiResponse.success(updatedUser, 'User updated successfully')
    );
});

export const deleteUser = asyncHandler(async (req, res) => {
    // Change: Remove parseInt to keep the ID as a string for UUID compatibility
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

// @desc    Get user profile
// @route   GET /me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {

    const user = await authService.getUserProfile(req.user.id);

  if (!user) {
    return res.status(404).json(
      ApiResponse.error('User not found')
    );
  }

  res.status(200).json(
    ApiResponse.success(user)
  );
});