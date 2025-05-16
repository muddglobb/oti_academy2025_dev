import { z } from 'zod';

// Define enums to match Prisma schema
const UserType = {
  DIKE: 'DIKE',
  UMUM: 'UMUM'
};

// Create payment schema validation
export const createPaymentSchema = z.object({
  // userId removed - will be taken from JWT token
  packageId: z.string().uuid(),
  courseId: z.string().uuid().optional(), // Made optional - will be required only for non-bundle packages
  type: z.enum(['DIKE', 'UMUM']),
  proofLink: z.string().url(),
});

// Update payment schema validation
export const updatePaymentSchema = z.object({
  proofLink: z.string().url().optional(),
});

// Complete back payment schema validation - To be removed later as it's no longer needed
export const completeBackSchema = z.object({});

// Payment filter schema for admin queries
export const paymentFilterSchema = z.object({
  status: z.enum(['PAID', 'APPROVED']).optional(),
  type: z.enum(['DIKE', 'UMUM']).optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
});