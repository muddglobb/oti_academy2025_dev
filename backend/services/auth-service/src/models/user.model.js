import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const UserModel = {
    createUser: async (data) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    },

    findUserByEmail: async (email) => {
        return await prisma.user.findUnique({
            where: { email },
        });
    },

    findUserById: async (id) => {
        return await prisma.user.findUnique({
            where: { id },
        });
    },

    updateUser: async (id, data) => {
        return await prisma.user.update({
            where: { id },
            data,
        });
    },

    deleteUser: async (id) => {
        return await prisma.user.delete({
            where: { id },
        });
    },
};


// Update profile schema
const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  });
  
  // Refresh token schema
const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
  
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateRefreshToken = validate(refreshTokenSchema);