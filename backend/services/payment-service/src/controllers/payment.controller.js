import { PaymentService } from '../services/payment.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { 
  createPaymentSchema, 
  paymentFilterSchema,
  completeBackSchema,
  updatePaymentSchema
} from '../schemas/payment.schema.js';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

/**
 * Create a new payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createPayment = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json(
        ApiResponse.error('Authentication required to create payment')
      );
    }
    
    // Get user ID from JWT token
    const userId = req.user.id;
    
    // Validate request body
    const validatedData = createPaymentSchema.parse(req.body);
    
    // Get user information from auth-service
    const userInfo = await PaymentService.getUserInfo(userId);
    
    if (!userInfo) {
      return res.status(404).json(
        ApiResponse.error('User tidak ditemukan')
      );
    }
    
    // Validate that payment type matches user type
    if (userInfo.type !== validatedData.type) {
      return res.status(400).json(
        ApiResponse.error(`Pengguna ${userInfo.type} hanya dapat membuat pembayaran dengan tipe ${userInfo.type}`)
      );
    }
    
    // Get package information to determine package type (beginner, intermediate, or bundle)
    const packageInfo = await PaymentService.getPackageInfo(validatedData.packageId);
    if (!packageInfo) {
      return res.status(404).json(
        ApiResponse.error('Paket tidak ditemukan')
      );
    }

    // Check if user already enrolled in any INTERMEDIATE course
    if (packageInfo.type === 'INTERMEDIATE') {
      const existingIntermediateEnrollment = await PaymentService.checkExistingIntermediateEnrollment(userId);
      
      if (existingIntermediateEnrollment.hasEnrollment) {
        return res.status(400).json(
          ApiResponse.error(`Anda sudah terdaftar di kelas INTERMEDIATE: ${existingIntermediateEnrollment.courseName}. Hanya boleh mengambil 1 kelas INTERMEDIATE.`)
        );
      }
    }

    // Check if package is a bundle
    const isBundle = packageInfo.type === 'BUNDLE';
    
    // For non-bundle packages (beginner/intermediate), courseId is required
    if (!isBundle && !validatedData.courseId) {
      return res.status(400).json(
        ApiResponse.error('CourseId diperlukan untuk paket non-bundle (ENTRY atau INTERMEDIATE)')
      );
    }
    
    // Only validate courseId for non-bundle packages
    if (!isBundle && validatedData.courseId) {
      const isCourseInPackage = await PaymentService.validateCourseInPackage(
        validatedData.packageId, 
        validatedData.courseId
      );
      if (!isCourseInPackage) {
        return res.status(400).json(
          ApiResponse.error('Course yang dipilih bukan bagian dari paket yang dipilih')
        );
      }
      
      // Check course quota availability - NEW VALIDATION
      const courseAvailability = await PaymentService.validateCourseAvailability(
        validatedData.courseId,
        packageInfo.type
      );
      
      if (!courseAvailability.valid) {
        return res.status(400).json(
          ApiResponse.error(courseAvailability.message)
        );
      }
    }
    
    // For bundle packages, ensure no courseId is provided
    if (isBundle && validatedData.courseId) {
      return res.status(400).json(
        ApiResponse.error('CourseId tidak boleh disertakan untuk paket BUNDLE')
      );
    }
    
    // Check user's existing payments and validate enrollment rules
    const userExistingPayments = await PaymentService.getUserPayments(userId);
    
    // If package is bundle, user shouldn't have any other payments
    if (isBundle) {
      if (userExistingPayments.length > 0) {
        return res.status(400).json(
          ApiResponse.error('Anda tidak dapat mendaftar paket bundle karena sudah terdaftar di kelas lain')
        );
      }
      
      // For bundle packages, we need to check quota for all courses in the bundle
      const coursesInBundle = await PaymentService.getCoursesInPackage(validatedData.packageId);
      
      // Check quota for each course in the bundle
      for (const course of coursesInBundle) {
        const courseAvailability = await PaymentService.validateCourseAvailability(
          course.id,
          'BUNDLE'
        );
        
        if (!courseAvailability.valid) {
          return res.status(400).json(
            ApiResponse.error(courseAvailability.message)
          );
        }
      }
    } 
    // If package is not bundle (beginner or intermediate)
    else {
      // Check if user already has a bundle package
      const hasBundle = userExistingPayments.some(payment => 
        payment.package && payment.package.type === 'BUNDLE'
      );
      
      if (hasBundle) {
        return res.status(400).json(
          ApiResponse.error('Anda tidak dapat mendaftar kelas baru karena sudah terdaftar di paket bundle')
        );
      }
      
      // Check if user already has the same package type
      const hasSamePackageType = userExistingPayments.some(payment => 
        payment.package && payment.package.type === packageInfo.type
      );
      
      if (hasSamePackageType) {
        return res.status(400).json(
          ApiResponse.error(`Anda sudah terdaftar di kelas ${packageInfo.type.toLowerCase()}. Tidak dapat mendaftar di kelas ${packageInfo.type.toLowerCase()} lainnya`)
        );
      }
    }
      // Prepare payment data
    let paymentData = {
      userId: userId, // Use userId from JWT token
      packageId: validatedData.packageId,
      type: validatedData.type,
      proofLink: validatedData.proofLink
    };
    
    // Only include courseId for non-bundle packages
    if (!isBundle && validatedData.courseId) {
      paymentData.courseId = validatedData.courseId;
    }
      // Create payment with validated data
    const payment = await PaymentService.createPayment(paymentData);
    
    // Add package information to the response
    const enhancedPayment = {
      ...payment,
      packageName: packageInfo.name,
      packageType: packageInfo.type,
      price: packageInfo.price
    };
    
    // Send payment confirmation email asynchronously
    try {
      const { sendPaymentConfirmationEmail } = await import('../utils/email-helper.js');
      sendPaymentConfirmationEmail(payment, userInfo, packageInfo)
        .then(success => {
          if (success) {
            console.log(`Payment confirmation email sent to: ${userInfo.email}`);
          }
        })
        .catch(emailError => {
          console.error('Async email sending error:', emailError);
        });
    } catch (emailError) {
      console.error('Failed to initiate payment confirmation email:', emailError.message);
      // Don't fail the payment creation if email fails
    }
    
    res.status(201).json(
      ApiResponse.success(
        enhancedPayment,
        'Pembayaran berhasil dibuat'
      )
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json(
        ApiResponse.error('Validation failed', errors)
      );
    }
    console.error('Error creating payment:', error);
    res.status(500).json(
      ApiResponse.error('Terjadi kesalahan saat membuat pembayaran')
    );
  }
};

/**
 * Get all payments (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
/**
 * Get all payments (admin only) with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPayments = async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Extract filter parameters
    const filters = {};
    
    if (req.query.status) {
      filters.status = req.query.status;
    }
    
    if (req.query.type) {
      filters.type = req.query.type;
    }
    
    if (req.query.backStatus) {
      filters.backStatus = req.query.backStatus;
    }
    
    if (req.query.isGroupPayment !== undefined) {
      filters.isGroupPayment = req.query.isGroupPayment === 'true';
    }
    
    if (req.query.startDate) {
      filters.startDate = new Date(req.query.startDate);
    }
    
    if (req.query.endDate) {
      filters.endDate = new Date(req.query.endDate);
    }

    // Build pagination object
    const pagination = {
      page,
      limit,
      sortBy,
      sortOrder
    };

    // Call service with filters and pagination
    const result = await PaymentService.getAllPayments(filters, pagination);
    
    res.status(200).json(
      ApiResponse.success(
        {
          payments: result.payments,
          pagination: result.pagination
        },
        'Payments retrieved successfully'
      )
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        ApiResponse.error(error.errors)
      );
    }
    
    console.error('Error fetching payments:', error);
    res.status(500).json(
      ApiResponse.error('Failed to get payments')
    );
  }
};

/**
 * Get payment by ID (admin or owner)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPaymentById = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get payment data with basic price info
    const payment = await PaymentService.getPaymentById(id);
    
    if (!payment) {
      return res.status(404).json(
        ApiResponse.error('Payment not found')
      );
    }
    
    // Check if user is allowed to access this payment
    // For regular payments: user must be owner or admin
    // For group payments: user must be creator, invited member, or admin
    let isAuthorized = req.user.role === 'ADMIN' || req.user.id === payment.userId;
    
    // Additional check for group payments
    if (!isAuthorized && payment.isGroupPayment && payment.invitedUserIds) {
      isAuthorized = payment.invitedUserIds.includes(req.user.id);
    }
    
    if (!isAuthorized) {
      return res.status(403).json(
        ApiResponse.error('You are not authorized to view this payment')
      );
    }
    
    // Format detailed payment with all required information
    // Pass the requesting user ID to get the correct course info for group payments
    const detailedPayment = await PaymentService.formatDetailedPayment(payment, req.user.id);
    
    res.status(200).json(
      ApiResponse.success(detailedPayment, 'Payment retrieved successfully')
    );
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

/**
 * Get user's payment history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserPayments = async (req, res) => {
  try {
    // Get user ID from JWT token (authenticated user)
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(401).json(
        ApiResponse.error('Authentication required to view payment history')
      );
    }
    
    // Fetch user's payments from database
    const payments = await PaymentService.getPaymentsByUserId(userId);
    
    if (!payments || payments.length === 0) {
      // Return empty array if user has no payments
      return res.status(200).json(
        ApiResponse.success([], 'No payments found for this user')
      );
    }
    
    // PERBAIKAN: Payments sudah di-format oleh getPaymentsByUserId dengan userId yang benar
    // Tidak perlu format ulang di sini karena sudah dilakukan di service
    res.status(200).json(
      ApiResponse.success(payments, 'User payments retrieved successfully')
    );
  } catch (error) {
    console.error('Error fetching user payment history:', error);
    throw error;
  }
};

/**
 * Update payment details (proofLink and/or back payment info)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePayment = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json(
        ApiResponse.error('Authentication required to update payment')
      );
    }
    
    // Get user ID from JWT token
    const userId = req.user.id;
    
    // Validate request body
    const validatedData = updatePaymentSchema.parse(req.body);
    
    // Check if there's any data to update
    if (Object.keys(validatedData).length === 0) {
      return res.status(400).json(
        ApiResponse.error('No valid fields provided for update')
      );
    }
    
    try {
      // Update payment
      const updatedPayment = await PaymentService.updatePayment(id, validatedData, userId);
      
      // PERBAIKAN: Pass userId (string) bukan userInfo (object)
      // Format detailed payment with all required information
      const detailedPayment = await PaymentService.formatDetailedPayment(updatedPayment, userId);
      
      return res.status(200).json(
        ApiResponse.success(detailedPayment, 'Payment updated successfully')
      );
    } catch (serviceError) {
      // Handle specific errors from service
      if (serviceError.message === 'Payment not found') {
        return res.status(404).json(
          ApiResponse.error('Payment not found')
        );
      } else if (serviceError.message === 'You are not authorized to update this payment') {
        return res.status(403).json(
          ApiResponse.error('You are not authorized to update this payment')
        );
      } else if (serviceError.message === 'Cannot update payment that has already been transferred back') {
        return res.status(400).json(
          ApiResponse.error('Cannot update payment that has already been transferred back')
        );
      } else {
        throw serviceError; // Re-throw for general error handler
      }
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        ApiResponse.error(error.errors)
      );
    }
    
    console.error('Error updating payment:', error);
    throw error;
  }
};

/**
 * Approve a payment (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get payment first to check if it exists
    const payment = await PaymentService.getPaymentById(id);
    
    if (!payment) {
      return res.status(404).json(
        ApiResponse.error('Payment not found')
      );
    }
    
    // Check if this is a group payment - should use group payment approval endpoint instead
    if (payment.isGroupPayment) {
      return res.status(400).json(
        ApiResponse.error('Ini adalah group payment. Gunakan endpoint /group-payments/:id/approve untuk approve group payment.')
      );
    }
    
    // Check if payment is already approved
    if (payment.status === 'APPROVED') {
      return res.status(400).json(
        ApiResponse.error('Payment is already approved')
      );
    }
      try {      
      // The approval process now handles both payment approval and enrollment creation in a transaction
      const result = await PaymentService.approvePayment(id);
      const updatedPayment = result.payment || result;
      
      // Invalidate enrollment cache for the associated course and all courses in bundles
      try {
        const { invalidateCache } = await import('../utils/cache-helper.js');
        
        // If payment is associated with a specific course, invalidate its cache
        if (updatedPayment.courseId) {
          invalidateCache('enrollment', updatedPayment.courseId);
        }
        
        // For bundle packages, invalidate cache for all included courses
        if (updatedPayment.packageId) {
          const packageInfo = await PaymentService.getPackageInfo(updatedPayment.packageId);
          if (packageInfo?.type === 'BUNDLE') {
            const coursesInBundle = await PaymentService.getCoursesInPackage(updatedPayment.packageId);
            if (coursesInBundle && Array.isArray(coursesInBundle)) {
              for (const course of coursesInBundle) {
                if (course.id) {
                  invalidateCache('enrollment', course.id);
                }
              }
            }
          }
        }
        
        // Also invalidate all-enrollments cache
        invalidateCache('all-enrollments', 'all-enrollments');
        console.log('✅ Enrollment cache invalidated after payment approval');
      } catch (cacheError) {
        console.error('❌ Error invalidating cache:', cacheError.message);
        // Non-critical error, continue with the payment approval flow
      }
      
      console.log('✅ Payment approved and enrollments created successfully');
      
      // PERBAIKAN: Pass userId (bukan userInfo object)
      // Format detailed payment with all required information
      const detailedPayment = await PaymentService.formatDetailedPayment(updatedPayment, updatedPayment.userId);
      
      // Success response
      res.status(200).json(
        ApiResponse.success(detailedPayment, 'Payment approved successfully')
      );
    } catch (approvalError) {
      console.error('Payment approval failed:', approvalError.message);
      
      // Return error response, keeping payment in PENDING state
      return res.status(500).json(
        ApiResponse.error(`Payment could not be approved: ${approvalError.message}`)
      );
    }
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json(
      ApiResponse.error('An unexpected error occurred while processing the payment approval')
    );
  }
};

/**
 * Complete back payment (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const completeBack = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get payment first to check if it exists
    const payment = await PaymentService.getPaymentById(id);
    
    if (!payment) {
      return res.status(404).json(
        ApiResponse.error('Payment not found')
      );
    }
    
    // Check if this is a DIKE payment
    if (payment.type !== 'DIKE') {
      return res.status(400).json(
        ApiResponse.error('Only DIKE payments can have back payments')
      );
    }
    
    // Check if back payment is already completed
    if (payment.backStatus === 'COMPLETED') {
      return res.status(400).json(
        ApiResponse.error('Back payment is already completed')
      );
    }
    
    // Check if there is a back payment request
    if (payment.backStatus !== 'REQUESTED') {
      return res.status(400).json(
        ApiResponse.error('No back payment has been requested for this payment')
      );
    }
    
    // Complete the back payment
    const updatedPayment = await PaymentService.completeBack(id);
    
    // PERBAIKAN: Pass userId (bukan userInfo object)
    // Format detailed payment with all required information
    const detailedPayment = await PaymentService.formatDetailedPayment(updatedPayment, updatedPayment.userId);
    
    res.status(200).json(
      ApiResponse.success(detailedPayment, 'Back payment completed successfully')
    );
  } catch (error) {
    console.error('Error completing back payment:', error);
    throw error;
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    await PaymentService.deletePayment(id);
    
    res.status(200).json({
      status: 'success',
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get enrollment statistics for a specific course
 * Shows quota and enrollment counts from approved payments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCourseEnrollmentStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Import CourseService at the top level to avoid circular dependencies
    const { CourseService } = await import('../services/course.service.js');
    
    // Ambil detail course terlebih dahulu
    const course = await CourseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json(
        ApiResponse.error('Course not found')
      );
    }

    // Use quota configuration from PaymentService
    const quotaConfig = PaymentService.getQuotaConfig();
    
    // Determine applicable quota based on course level
    let applicableEntryQuota;
    if (course.level === 'INTERMEDIATE') {
      applicableEntryQuota = quotaConfig.intermediateQuota;
    } else {
      applicableEntryQuota = quotaConfig.entryQuota;
    }
    
    const totalQuota = applicableEntryQuota + quotaConfig.bundleQuota;

    // Gunakan fungsi yang sudah ada untuk menghitung enrollment
    const enrollmentCounts = await PaymentService.getCourseEnrollmentCount(courseId);
    
    // Hitung slot tersedia
    const entryAvailable = applicableEntryQuota - enrollmentCounts.entryIntermediateCount;
    const bundleAvailable = quotaConfig.bundleQuota - enrollmentCounts.bundleCount;
    
    // Format response
    const response = {
      course: {
        id: course.id,
        title: course.title,
        level: course.level
      },
      quota: {
        total: totalQuota,
        entryIntermediateQuota: applicableEntryQuota,
        bundleQuota: quotaConfig.bundleQuota
      },
      enrollments: {
        entryIntermediateCount: enrollmentCounts.entryIntermediateCount,
        bundleCount: enrollmentCounts.bundleCount,
        total: enrollmentCounts.total
      },
      available: {
        entryIntermediateAvailable: Math.max(0, entryAvailable),
        bundleAvailable: Math.max(0, bundleAvailable),
        totalAvailable: Math.max(0, totalQuota - enrollmentCounts.total)
      },
      percentageFilled: Math.round((enrollmentCounts.total / totalQuota) * 100)
    };
    
    res.status(200).json(ApiResponse.success(response));
  } catch (error) {
    console.error('Error getting enrollment stats:', error);
    res.status(500).json(ApiResponse.error('Error retrieving enrollment statistics'));
  }
};

/**
 * @desc    Mendapatkan jumlah pendaftaran untuk semua kursus
 * @route   GET /payments/stats
 * @access  Admin only
 */
export const getAllCoursesEnrollmentStats = async (req, res) => {
  try {
    // Get enrollment counts for all courses
    const enrollmentStats = await PaymentService.getAllCoursesEnrollmentCount();
    
    if (!enrollmentStats.success) {
      return res.status(400).json(
        ApiResponse.error(enrollmentStats.message)
      );
    }
      // Return successful response with payment counts in meta
    res.status(200).json(
      ApiResponse.success(
        enrollmentStats.data, 
        enrollmentStats.message, 
        { paymentCounts: enrollmentStats.paymentCounts }
      )
    );
  } catch (error) {
    console.error('Error getting all courses enrollment stats:', error);
    return res.status(500).json(
      ApiResponse.error('Terjadi kesalahan saat mendapatkan statistik pendaftaran')
    );
  }
};

export const getNeedToApprovePayments = async (req, res) => {
  try{
    const payments = await PaymentService.getNeedToApprovePayments();
    
    if (!payments) {
      return res.status(404).json(
        ApiResponse.error('No payments found')
      );
    }
    
    res.status(200).json(
      ApiResponse.success(payments, 'Payments retrieved successfully')
    );
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json(
      ApiResponse.error('An unexpected error occurred while processing the request')
    );
  }
};

/**
 * Debug: Clear cache and check enrollment count
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const debugEnrollmentCount = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Clear cache first
    const { invalidateCache } = await import('../utils/cache-helper.js');
    invalidateCache('enrollment', courseId);
    invalidateCache('all-enrollments', 'all-enrollments');
    
    // Get fresh enrollment count
    const enrollmentCount = await PaymentService.getCourseEnrollmentCount(courseId);
    
    // Get all payments for this course for debugging
    const allPayments = await prisma.payment.findMany({
      where: {
        courseId,
        status: 'APPROVED'
      },
      select: {
        id: true,
        userId: true,
        isGroupPayment: true,
        totalParticipants: true,
        groupStatus: true,
        createdAt: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        courseId,
        enrollmentCount,
        allPayments: allPayments.map(p => ({
          id: p.id.substring(0, 8),
          isGroup: p.isGroupPayment,
          participants: p.totalParticipants || 1,
          groupStatus: p.groupStatus,
          createdAt: p.createdAt
        })),
        totalPayments: allPayments.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
