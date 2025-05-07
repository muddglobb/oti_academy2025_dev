import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../middleware/async.middleware.js';

const prisma = new PrismaClient();

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
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
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
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
    const { name, email } = req.body;

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

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
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

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            type: true,
            nim: true,
            createdAt: true,
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