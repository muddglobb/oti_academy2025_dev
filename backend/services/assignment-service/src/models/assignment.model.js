import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const AssignmentModel = {
  async create(data) {
    return await prisma.assignment.create({
      data
    });
  },

  async findById(id) {
    return await prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: false
      }
    });
  },

  async findByIdWithSubmissions(id) {
    return await prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: true
      }
    });
  },

  async findAll(filter = {}, options = {}) {
    const { skip, take, orderBy = { createdAt: 'desc' } } = options;
    
    return await prisma.assignment.findMany({
      where: filter,
      skip,
      take,
      orderBy,
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    });
  },

  async findByCourse(courseId, options = {}) {
    const { skip, take, orderBy = { dueDate: 'asc' } } = options;
    
    return await prisma.assignment.findMany({
      where: { 
        courseId,
        status: 'ACTIVE'
      },
      skip,
      take,
      orderBy,
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    });
  },

  async update(id, data) {
    return await prisma.assignment.update({
      where: { id },
      data
    });
  },

  async delete(id) {
    return await prisma.assignment.delete({
      where: { id }
    });
  },

  async exists(id) {
    const count = await prisma.assignment.count({
      where: { id }
    });
    return count > 0;
  }
};