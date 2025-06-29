import { z } from 'zod';

// Define enums to match Prisma schema
const UserType = {
  DIKE: 'DIKE',
  UMUM: 'UMUM'
};

// Enhanced URL validator for proof links
const proofLinkValidator = z.string()
  .min(10, 'Proof link minimal 10 karakter')
  .url('Proof link harus berupa URL yang valid')
  .refine((url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }, 'Proof link harus menggunakan protokol HTTP atau HTTPS')
  .refine((url) => {
    try {
      const parsed = new URL(url);
      // Allow HTTPS URLs for security
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Proof link harus menggunakan protokol HTTPS untuk keamanan');

// Create payment schema validation
export const createPaymentSchema = z.object({
  // userId removed - will be taken from JWT token
  packageId: z.string().uuid(),
  courseId: z.string().uuid().optional(), // Made optional - will be required only for non-bundle packages
  type: z.enum(['DIKE', 'UMUM']),
  proofLink: proofLinkValidator,
});

// Update payment schema validation
export const updatePaymentSchema = z.object({
  proofLink: proofLinkValidator.optional(),
});

// Complete back payment schema validation - To be removed later as it's no longer needed
export const completeBackSchema = z.object({});

// Payment filter schema for admin queries
export const paymentFilterSchema = z.object({
  status: z.enum(['PAID', 'APPROVED']).optional(),
  type: z.enum(['DIKE', 'UMUM']).optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  isGroupPayment: z.boolean().optional(), // Add group payment filter
});

// Group payment member schema
const groupPaymentMemberSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  courseId: z.string().uuid('Course ID harus berupa UUID yang valid')
});

// Create group payment schema validation
export const createGroupPaymentSchema = z.object({
  packageId: z.string().uuid('Package ID harus berupa UUID yang valid'),
  creatorCourseId: z.string().uuid('Creator Course ID harus berupa UUID yang valid'),
  proofLink: proofLinkValidator,
  members: z.array(groupPaymentMemberSchema)
    .min(1, 'Minimal 1 member harus diundang')
    .max(10, 'Maksimal 10 member dapat diundang')
    .refine((members) => {
      // Check for duplicate emails
      const emails = members.map(m => m.email.toLowerCase());
      return emails.length === new Set(emails).size;
    }, 'Email member tidak boleh duplikat')
});