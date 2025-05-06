import { z } from 'zod';

// Define enums to match Prisma schema
const UserType = {
  DIKE: 'DIKE',
  UMUM: 'UMUM'
};

const BackPaymentMethod = {
  BNI: 'BNI',
  GOPAY: 'GOPAY',
  OVO: 'OVO',
  DANA: 'DANA'
};

// Create payment schema validation
export const createPaymentSchema = z.object({
  userId: z.string().uuid(),
  packageId: z.string().uuid(),
  courseId: z.string().uuid(), // Menambahkan courseId untuk tracking enrollment
  type: z.enum(['DIKE', 'UMUM']),
  proofLink: z.string().url(),
  backPaymentMethod: z.enum(['BNI', 'GOPAY', 'OVO', 'DANA']).optional(),
  backAccountNumber: z.string().min(1).optional(),
  backRecipient: z.string().min(1).optional(),
}).refine(data => {
  if (data.type === 'DIKE') {
    return data.backPaymentMethod && data.backAccountNumber && data.backRecipient;
  }
  return true;
}, {
  message: 'DIKE users require backPaymentMethod, backAccountNumber, and backRecipient',
  path: ['backPaymentMethod', 'backAccountNumber', 'backRecipient']
});

// Complete back payment schema validation
export const completeBackSchema = z.object({
  backCompletedAt: z.date().default(() => new Date())
});

// Payment filter schema for admin queries
export const paymentFilterSchema = z.object({
  status: z.enum(['PAID', 'APPROVED']).optional(),
  type: z.enum(['DIKE', 'UMUM']).optional(),
  backStatus: z.enum(['REQUESTED', 'COMPLETED']).optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
});