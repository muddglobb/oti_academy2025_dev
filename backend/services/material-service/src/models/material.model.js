import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const MaterialModel = {
  async create(data) {
    return await prisma.material.create({
      data
    });
  },

  async findById(id) {
    return await prisma.material.findUnique({
      where: { id },
      include: {
        section: true
      }
    });
  },

  async findBySection(sectionId) {
    return await prisma.material.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' }
    });
  },

  async update(id, data) {
    return await prisma.material.update({
      where: { id },
      data
    });
  },

  async delete(id) {
    return await prisma.material.delete({
      where: { id }
    });
  },
  
  async getNextOrder(sectionId) {
    const result = await prisma.material.aggregate({
      where: { sectionId },
      _max: { order: true }
    });
    
    return (result._max.order || 0) + 1;
  },
  
  async findByCourseId(courseId, options = {}) {
    // First, get all sections for the course
    const sections = await prisma.section.findMany({
      where: { courseId },
      select: { id: true }
    });
    
    const sectionIds = sections.map(s => s.id);
    
    // Then query materials based on these section IDs
    return await prisma.material.findMany({
      where: {
        sectionId: { in: sectionIds },
        status: 'ACTIVE'
      },
      ...options
    });
  }
};