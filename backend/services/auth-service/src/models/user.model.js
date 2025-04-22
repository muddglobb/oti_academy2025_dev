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


