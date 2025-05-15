import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SectionModel = {
  async create(data) {
    return await prisma.section.create({
      data
    });
  },

  async findById(id) {
    return await prisma.section.findUnique({
      where: { id }
    });
  },

  async findByCourse(courseId) {
    return await prisma.section.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        materials: {
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  async update(id, data) {
    return await prisma.section.update({
      where: { id },
      data
    });
  },

  async delete(id) {
    return await prisma.section.delete({
      where: { id }
    });
  },

  async exists(id) {
    const count = await prisma.section.count({
      where: { id }
    });
    return count > 0;
  },
  
  async getNextOrder(courseId) {
    const result = await prisma.section.aggregate({
      where: { courseId },
      _max: { order: true }
    });
    
    return (result._max.order || 0) + 1;
  }
};