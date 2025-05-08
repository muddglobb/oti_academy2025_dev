import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CourseModel = {
  async create(data) {
    return await prisma.course.create({
      data
    });
  },

  async findById(id) {
    return await prisma.course.findUnique({
      where: { id },
      include: {
        sessions: true
      }
    });
  },

  async exists(id) {
    const count = await prisma.course.count({
      where: { id }
    });
    return count > 0;
  },

  async findAll(filter = {}, options = {}) {
    const { skip, take, orderBy = { createdAt: 'desc' } } = options;
    
    return await prisma.course.findMany({
      where: filter,
      skip,
      take,
      orderBy,
      include: {
        sessions: {
          orderBy: { startAt: 'asc' }
        }
      }
    });
  },

  async update(id, data) {
    return await prisma.course.update({
      where: { id },
      data,
      include: {
        sessions: true
      }
    });
  },

  async delete(id) {
    return await prisma.course.delete({
      where: { id }
    });
  }
};