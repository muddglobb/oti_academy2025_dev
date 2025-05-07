import { PaymentService } from '../services/payment.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { createEnrollmentAfterPayment } from '../utils/enrollment-helper.js';
import { 
  createPaymentSchema, 
  paymentFilterSchema,
  completeBackSchema
} from '../schemas/payment.schema.js';

/**
 * Create a new payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createPayment = async (req, res) => {
  try {
    // Validate request body
    const validatedData = createPaymentSchema.parse(req.body);
    
    // Validasi user ID jika tidak sama dengan ID dari token
    if (req.user && req.user.id && req.user.id !== validatedData.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json(
        ApiResponse.error('Anda hanya dapat membuat pembayaran untuk diri sendiri')
      );
    }
    
    // Dapatkan informasi lengkap user dari auth-service untuk validasi tipe
    const userInfo = await PaymentService.getUserInfo(validatedData.userId);
    
    if (!userInfo) {
      return res.status(404).json(
        ApiResponse.error('User tidak ditemukan')
      );
    }
    
    // Validasi tipe pembayaran harus sesuai dengan tipe user
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
    
    // Validasi courseId harus bagian dari packageId yang dipilih
    const isCourseInPackage = await PaymentService.validateCourseInPackage(
      validatedData.packageId, 
      validatedData.courseId
    );
    if (!isCourseInPackage) {
      return res.status(400).json(
        ApiResponse.error('Course yang dipilih bukan bagian dari paket yang dipilih')
      );
    }
    
    // Check user's existing payments and validate enrollment rules
    const userExistingPayments = await PaymentService.getUserPayments(validatedData.userId);
    
    // If package is bundle, user shouldn't have any other payments
    if (packageInfo.type === 'BUNDLE') {
      if (userExistingPayments.length > 0) {
        return res.status(400).json(
          ApiResponse.error('Anda tidak dapat mendaftar paket bundle karena sudah terdaftar di kelas lain')
        );
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
    
    // Prepare payment data based on user type
    let paymentData = {
      userId: validatedData.userId,
      packageId: validatedData.packageId,
      courseId: validatedData.courseId,
      type: validatedData.type,
      proofLink: validatedData.proofLink
    };
    
    // Add back payment fields only for DIKE users
    if (validatedData.type === 'DIKE') {
      paymentData.backPaymentMethod = validatedData.backPaymentMethod;
      paymentData.backAccountNumber = validatedData.backAccountNumber;
      paymentData.backRecipient = validatedData.backRecipient;
      paymentData.backStatus = 'REQUESTED';
    }
    
    // Create payment with validated data
    const payment = await PaymentService.createPayment(paymentData);
    
    // Tambahkan informasi harga dari package
    const enhancedPayment = {
      ...payment,
      packageName: packageInfo.name,
      packageType: packageInfo.type,
      price: packageInfo.price
    };
    
    res.status(201).json(
      ApiResponse.success(enhancedPayment, 'Payment created successfully')
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        ApiResponse.error(error.errors)
      );
    }
    
    console.error('Error creating payment:', error);
    throw error;
  }
};

/**
 * Get all payments (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPayments = async (req, res) => {
  try {
    // Validate and parse query filters
    const filters = paymentFilterSchema.parse(req.query);
    
    // Extract pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Get paginated payments
    const result = await PaymentService.getAllPayments({
      ...filters,
      page,
      limit
    });
    
    res.status(200).json(
      ApiResponse.success(result, 'Payments retrieved successfully')
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        ApiResponse.error(error.errors)
      );
    }
    
    throw error;
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
    if (req.user.role !== 'ADMIN' && req.user.id !== payment.userId) {
      return res.status(403).json(
        ApiResponse.error('You are not authorized to view this payment')
      );
    }
    
    // Enhance payment with additional information
    const enhancedPayment = await enhancePaymentResponse(payment);
    
    res.status(200).json(
      ApiResponse.success(enhancedPayment, 'Payment retrieved successfully')
    );
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

/**
 * Enhance payment response with additional information
 * @param {Object} payment - Payment data
 * @returns {Object} Enhanced payment data
 */
async function enhancePaymentResponse(payment) {
  // Create a new object based on payment
  const enhancedPayment = { ...payment };
  
  // 1. Get user info from Auth-Service
  try {
    const userInfo = await PaymentService.getUserInfo(payment.userId);
    if (userInfo) {
      enhancedPayment.userName = userInfo.name || 'Nama Tidak Tersedia';
      enhancedPayment.userEmail = userInfo.email || 'Email Tidak Tersedia';
    } else {
      // Fallback values if userInfo couldn't be fetched
      enhancedPayment.userName = 'Nama Tidak Tersedia';
      enhancedPayment.userEmail = 'Email Tidak Tersedia';
      console.warn(`Could not fetch user info for userId: ${payment.userId}`);
    }
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    // Provide default values in case of error
    enhancedPayment.userName = 'Nama Tidak Tersedia';
    enhancedPayment.userEmail = 'Email Tidak Tersedia';
  }
  
  // 2. Get package details from Package-Service
  // Note: Some basic package info (name, type, price) is already included in payment
  // by the enhancePaymentsWithPrice method in PaymentService
  
  // 2a. Get courses in the package
  try {
    const coursesInPackage = await PaymentService.getCoursesInPackage(payment.packageId);
    enhancedPayment.coursesInPackage = coursesInPackage;
  } catch (error) {
    console.error('Error fetching courses in package:', error.message);
    enhancedPayment.coursesInPackage = [];
  }
  
  // 3. Determine enrollment status
  // A simple check from the enrollment-queue or enrollment-service
  try {
    const enrollmentStatus = await PaymentService.checkEnrollmentStatus(payment.id);
    enhancedPayment.enrolled = enrollmentStatus.enrolled;
  } catch (error) {
    console.error('Error checking enrollment status:', error.message);
    enhancedPayment.enrolled = false;
  }
  
  // 4. Add refund flags based on payment data
  enhancedPayment.isRefundable = 
    payment.type === 'DIKE' && 
    payment.status === 'PAID' && 
    payment.backStatus === 'REQUESTED';
    
  enhancedPayment.canApproveBack = 
    payment.type === 'DIKE' && 
    payment.backStatus === 'REQUESTED' && 
    payment.backCompletedAt === null;
  
  // 5. Format dates for better readability
  if (payment.createdAt) {
    enhancedPayment.createdAtFormatted = formatDateTimeForDisplay(payment.createdAt);
  }
  
  if (payment.updatedAt) {
    enhancedPayment.updatedAtFormatted = formatDateTimeForDisplay(payment.updatedAt);
  }
  
  if (payment.backCompletedAt) {
    enhancedPayment.backCompletedAtFormatted = formatDateTimeForDisplay(payment.backCompletedAt);
  }
  
  return enhancedPayment;
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDateTimeForDisplay(date) {
  if (!date) return null;
  
  const parsedDate = new Date(date);
  
  // Format as YYYY-MM-DD HH:mm:ss
  return parsedDate.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, '$3-$1-$2 $4');
}

/**
 * Approve payment (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const approvePayment = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if payment exists
    const payment = await PaymentService.getPaymentById(id);
    
    if (!payment) {
      return res.status(404).json(
        ApiResponse.error('Payment not found')
      );
    }
    
    // Check if payment is already approved
    if (payment.status === 'APPROVED') {
      return res.status(400).json(
        ApiResponse.error('Payment is already approved')
      );
    }
    
    // Approve payment
    const updatedPayment = await PaymentService.approvePayment(id);
    
    // Notifikasi ke enrollment service
    try {
      await createEnrollmentAfterPayment(updatedPayment);
      console.log(`Notifikasi enrollment berhasil dikirim untuk payment ${id}`);
    } catch (enrollError) {
      // Log error tetapi jangan gagalkan proses approval
      console.error(`Error notifying enrollment service: ${enrollError.message}`);
      // Tambahkan ke respons bahwa ada warning
      return res.status(200).json(
        ApiResponse.success(
          updatedPayment, 
          'Payment approved successfully, but there was an issue with enrollment notification. The system will retry automatically.'
        )
      );
    }
    
    res.status(200).json(
      ApiResponse.success(updatedPayment, 'Payment approved successfully')
    );
  } catch (error) {
    console.error('Error approving payment:', error);
    throw error;
  }
};

/**
 * Request back payment (DIKE only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const requestBack = async (req, res) => {
  const { id } = req.params;
  const backData = req.body;
  
  // Check if payment exists
  const payment = await PaymentService.getPaymentById(id);
  
  if (!payment) {
    return res.status(404).json(
      ApiResponse.error('Payment not found')
    );
  }
  
  // Check if user owns the payment
  if (payment.userId !== req.user.id) {
    return res.status(403).json(
      ApiResponse.error('You can only request back for your own payments')
    );
  }
  
  // Check if payment type is DIKE
  if (payment.type !== 'DIKE') {
    return res.status(400).json(
      ApiResponse.error('Only DIKE payments can request back')
    );
  }
  
  // Check if back payment is already completed
  if (payment.backStatus === 'COMPLETED') {
    return res.status(400).json(
      ApiResponse.error('Back payment is already completed')
    );
  }
  
  // Update back payment info
  const updatedPayment = await PaymentService.requestBack(id, {
    backPaymentMethod: backData.backPaymentMethod,
    backAccountNumber: backData.backAccountNumber,
    backRecipient: backData.backRecipient
  });
  
  res.status(200).json(
    ApiResponse.success(updatedPayment, 'Back payment requested successfully')
  );
};

/**
 * Complete back payment (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const completeBack = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Validate request body
    completeBackSchema.parse(req.body);
    
    // Check if payment exists
    const payment = await PaymentService.getPaymentById(id);
    
    if (!payment) {
      return res.status(404).json(
        ApiResponse.error('Payment not found')
      );
    }
    
    // Check if payment type is DIKE
    if (payment.type !== 'DIKE') {
      return res.status(400).json(
        ApiResponse.error('Only DIKE payments can be completed for back payment')
      );
    }
    
    // Check if back payment is already completed
    if (payment.backStatus === 'COMPLETED') {
      return res.status(400).json(
        ApiResponse.error('Back payment is already completed')
      );
    }
    
    // Complete back payment
    const updatedPayment = await PaymentService.completeBack(id);
    
    res.status(200).json(
      ApiResponse.success(updatedPayment, 'Back payment completed successfully')
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        ApiResponse.error(error.errors)
      );
    }
    
    throw error;
  }
};

/**
 * Delete payment by ID (admin or owner)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deletePayment = async (req, res) => {
  const { id } = req.params;
  
  // Check if payment exists
  const payment = await PaymentService.getPaymentById(id);
  
  if (!payment) {
    return res.status(404).json(
      ApiResponse.error('Payment not found')
    );
  }
  
  // Check authorization: only admin or payment owner can delete
  if (req.user.role !== 'ADMIN' && req.user.id !== payment.userId) {
    return res.status(403).json(
      ApiResponse.error('You are not authorized to delete this payment')
    );
  }

  // If payment is already approved and user is not admin, don't allow deletion
  if (payment.status === 'APPROVED' && req.user.role !== 'ADMIN') {
    return res.status(400).json(
      ApiResponse.error('Cannot delete payment that has been approved. Please contact admin.')
    );
  }
  
  // Delete payment
  await PaymentService.deletePayment(id);
  
  res.status(200).json(
    ApiResponse.success(null, 'Payment deleted successfully')
  );
};