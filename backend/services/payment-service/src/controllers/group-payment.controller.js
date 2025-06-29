import { PaymentService } from '../services/payment.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { createGroupPaymentSchema } from '../schemas/payment.schema.js';

/**
 * Validate invite emails - SIMPLIFIED untuk hanya check email availability
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const validateInviteEmails = async (req, res) => {
  try {
    const { emails } = req.body;
    
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json(
        ApiResponse.error('Minimal 1 email harus diisi')
      );
    }

    // Validate email format basic check
    const invalidEmailFormats = emails.filter(email => 
      !email || typeof email !== 'string' || !email.includes('@')
    );
    
    if (invalidEmailFormats.length > 0) {
      return res.status(400).json(
        ApiResponse.error('Semua email harus memiliki format yang valid')
      );
    }

    // Use existing validateInviteEmails method (email only)
    const validation = await PaymentService.validateInviteEmails(emails);
    

    // Format response dengan bundle information
    const response = {
      validEmails: validation.validEmails || [],
      invalidEmails: validation.invalidEmails || [],
      existingUsers: validation.existingUsers || [],
      nonExistingEmails: validation.nonExistingEmails || [],
      usersWithIntermediateEnrollment: validation.usersWithIntermediateEnrollment || [],
      usersWithBundleEnrollment: validation.usersWithBundleEnrollment || [], // Tambahan
      summary: {
        total: emails.length,
        valid: validation.validEmails?.length || 0,
        invalid: (validation.invalidEmails?.length || 0),
        alreadyEnrolledIntermediate: validation.usersWithIntermediateEnrollment?.length || 0,
        alreadyEnrolledBundle: validation.usersWithBundleEnrollment?.length || 0 // Tambahan
      }
    };
    
    // Determine message based on results
    let message = 'Email validation completed';
    
    if (response.usersWithIntermediateEnrollment.length > 0) {
      message += `. ${response.usersWithIntermediateEnrollment.length} user(s) sudah memiliki kelas INTERMEDIATE dan tidak dapat diundang.`;
    }
    
    if (response.usersWithBundleEnrollment.length > 0) {
      message += ` ${response.usersWithBundleEnrollment.length} user(s) sudah memiliki paket BUNDLE dan tidak dapat diundang.`;
    }
    
    if (response.nonExistingEmails.length > 0) {
      message += ` ${response.nonExistingEmails.length} email(s) tidak ditemukan di sistem.`;
    }
    
    res.status(200).json(
      ApiResponse.success(response, message)
    );
  } catch (error) {
    console.error('Error validating emails:', error);
    res.status(500).json(
      ApiResponse.error('Terjadi kesalahan saat validasi email')
    );
  }
};

/**
 * Create group payment - UPDATED FOR APPROACH 2
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createGroupPayment = async (req, res) => {
  try {
    const creatorId = req.user.id;

    
    // Validate request body with schema
    const validatedData = createGroupPaymentSchema.parse(req.body);
    const { packageId, creatorCourseId, members, proofLink } = validatedData;

    const groupPayment = await PaymentService.createGroupPayment({
      creatorId,
      packageId,
      creatorCourseId,
      members,
      proofLink
    });

    res.status(201).json(
      ApiResponse.success(groupPayment, 'Group payment berhasil dibuat')
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json(
        ApiResponse.error('Validation error', errors)
      );
    }

    console.error('Error creating group payment:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Terjadi kesalahan saat membuat group payment')
    );
  }
};

/**
 * Get all group payments (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getGroupPayments = async (req, res) => {
  try {
    const groupPayments = await PaymentService.getGroupPayments();
    
    res.status(200).json(
      ApiResponse.success(groupPayments, 'Group payments retrieved successfully')
    );
  } catch (error) {
    console.error('Error getting group payments:', error);
    res.status(500).json(
      ApiResponse.error('Terjadi kesalahan saat mengambil group payments')
    );
  }
};

/**
 * Get group payment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getGroupPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const groupPayment = await PaymentService.getGroupPaymentById(id);
    
    res.status(200).json(
      ApiResponse.success(groupPayment, 'Group payment retrieved successfully')
    );
  } catch (error) {
    console.error('Error getting group payment:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Terjadi kesalahan saat mengambil group payment')
    );
  }
};

/**
 * Approve group payment (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const approveGroupPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use the GROUP payment approval method, not regular payment approval
    const result = await PaymentService.approveGroupPayment(id);
    
    // console.log('Group payment approval result:', {
    //   paymentId: result.payment?.id,
    //   groupStatus: result.payment?.groupStatus,
    //   totalEnrolled: result.totalEnrolled,
    //   memberIds: result.memberIds
    // });
    
    // TAMBAHAN: Force refresh cache setelah approval
    try {
      const { invalidateCache } = await import('../utils/cache-helper.js');
      
      // Invalidate semua cache terkait enrollment
      if (result.payment?.courseId) {
        invalidateCache('enrollment', result.payment.courseId);
      }
      invalidateCache('all-enrollments', 'all-enrollments');
      
      console.log('✅ Cache invalidated in controller after group payment approval');
    } catch (cacheError) {
      console.error('❌ Controller cache invalidation error:', cacheError.message);
    }
    
    res.status(200).json(
      ApiResponse.success(result, `Group payment berhasil diapprove dan ${result.totalEnrolled} enrollment dibuat`)
    );
  } catch (error) {
    console.error('Error approving group payment:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Terjadi kesalahan saat approve group payment')
    );
  }
};

/**
 * Delete group payment (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteGroupPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await PaymentService.deleteGroupPayment(id);
    
    res.status(200).json(
      ApiResponse.success(result, 'Group payment berhasil dihapus')
    );
  } catch (error) {
    console.error('Error deleting group payment:', error);
    res.status(500).json(
      ApiResponse.error(error.message || 'Terjadi kesalahan saat menghapus group payment')
    );
  }
};
