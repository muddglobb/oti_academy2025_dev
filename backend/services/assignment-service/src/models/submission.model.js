import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SubmissionModel = {
  async create(data) {
    return await prisma.submission.create({
      data
    });
  },

  async findById(id) {
    return await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: true
      }
    });
  },

  async findByAssignmentAndUser(assignmentId, userId) {
    return await prisma.submission.findFirst({
      where: {
        assignmentId,
        userId
      }
    });
  },

  async findByAssignment(assignmentId) {
    return await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        assignment: true
      },
      orderBy: { submittedAt: 'desc' }
    });
  },

  async findByUser(userId) {
    return await prisma.submission.findMany({
      where: { userId },
      include: {
        assignment: true
      },
      orderBy: { submittedAt: 'desc' }
    });
  },

  async update(id, data) {
    return await prisma.submission.update({
      where: { id },
      data
    });
  },

  async delete(id) {
    return await prisma.submission.delete({
      where: { id }
    });
  }
};