const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../middlewares/error.middleware');
const { successResponse, paginatedResponse, notFoundResponse, createdResponse } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// All routes require authentication
router.use(authMiddleware);

/**
 * @desc    Get all fee invoices
 * @route   GET /api/v1/fees
 * @access  Private
 */
router.get('/', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    studentId = '', 
    status = '',
    feeType = '',
    academicYear = ''
  } = req.query;
  
  // Students can only see their own fees
  const queryStudentId = req.user.role === 'student' ? req.user.id : studentId;
  
  // TODO: Implement with FeeInvoice model
  const mockFees = [
    {
      id: '1',
      invoiceNumber: 'INV-20241130-1001',
      studentId: queryStudentId || 'student-uuid',
      studentName: 'John Doe',
      academicYear: '2024-2025',
      semester: 'Fall 2024',
      feeType: 'tuition',
      amount: 5000.00,
      currency: 'USD',
      dueDate: '2024-12-31',
      status: 'pending',
      paidAmount: 0,
      discount: 0,
      lateFee: 0,
    },
  ];
  
  paginatedResponse(res, mockFees, page, limit, mockFees.length, 'Fee invoices retrieved successfully');
}));

/**
 * @desc    Get fee invoice by ID
 * @route   GET /api/v1/fees/:id
 * @access  Private
 */
router.get('/:id', asyncHandler(async (req, res) => {
  // TODO: Implement with FeeInvoice model
  const mockFee = {
    id: req.params.id,
    invoiceNumber: 'INV-20241130-1001',
    studentId: 'student-uuid',
    studentName: 'John Doe',
    studentEmail: 'john.doe@example.com',
    academicYear: '2024-2025',
    semester: 'Fall 2024',
    feeType: 'tuition',
    amount: 5000.00,
    currency: 'USD',
    dueDate: '2024-12-31',
    status: 'pending',
    paidAmount: 0,
    paymentDate: null,
    paymentMethod: null,
    transactionId: null,
    discount: 0,
    lateFee: 0,
    description: 'Tuition fee for Fall 2024 semester',
    createdAt: '2024-11-01',
  };
  
  // Students can only view their own fees
  if (req.user.role === 'student' && req.user.id !== mockFee.studentId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }
  
  successResponse(res, mockFee, 'Fee invoice retrieved successfully');
}));

/**
 * @desc    Create a new fee invoice
 * @route   POST /api/v1/fees
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authorize('admin'),
  [
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('academicYear').notEmpty().withMessage('Academic year is required'),
    body('feeType').isIn(['tuition', 'library', 'lab', 'sports', 'exam', 'registration', 'other']).withMessage('Invalid fee type'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('semester').optional().trim(),
    body('description').optional().trim(),
    body('discount').optional().isFloat({ min: 0 }),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { 
      studentId, 
      academicYear, 
      semester, 
      feeType, 
      amount, 
      dueDate, 
      description,
      discount = 0,
      currency = 'USD'
    } = req.body;
    
    // TODO: Implement with FeeInvoice model
    // 1. Verify student exists
    // 2. Generate unique invoice number
    // 3. Create invoice
    // 4. Send notification to student
    
    const mockInvoice = {
      id: 'new-invoice-uuid',
      invoiceNumber: `INV-${Date.now()}`,
      studentId,
      academicYear,
      semester,
      feeType,
      amount,
      currency,
      dueDate,
      status: 'pending',
      paidAmount: 0,
      discount,
      lateFee: 0,
      description,
      createdAt: new Date(),
    };
    
    createdResponse(res, mockInvoice, 'Fee invoice created successfully');
  })
);

/**
 * @desc    Update fee invoice
 * @route   PUT /api/v1/fees/:id
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { amount, dueDate, discount, lateFee, description, status } = req.body;
    
    // TODO: Implement with FeeInvoice model
    // 1. Find invoice
    // 2. Update allowed fields
    // 3. Recalculate status if needed
    // 4. Send notification if important changes
    
    const mockInvoice = {
      id: req.params.id,
      amount,
      dueDate,
      discount,
      lateFee,
      description,
      status,
    };
    
    successResponse(res, mockInvoice, 'Fee invoice updated successfully');
  })
);

/**
 * @desc    Record payment for fee invoice
 * @route   POST /api/v1/fees/:id/payment
 * @access  Private
 */
router.post(
  '/:id/payment',
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Payment amount must be positive'),
    body('paymentMethod').isIn(['cash', 'card', 'bank_transfer', 'cheque', 'online']).withMessage('Invalid payment method'),
    body('transactionId').optional().trim(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { amount, paymentMethod, transactionId } = req.body;
    
    // TODO: Implement with FeeInvoice model
    // 1. Find invoice
    // 2. Verify student owns invoice (unless admin)
    // 3. Verify payment amount doesn't exceed remaining
    // 4. Record payment
    // 5. Update invoice status
    // 6. Send payment confirmation
    
    const mockPayment = {
      invoiceId: req.params.id,
      amount,
      paymentMethod,
      transactionId,
      paymentDate: new Date(),
      remainingAmount: 0,
      status: 'paid',
    };
    
    createdResponse(res, mockPayment, 'Payment recorded successfully');
  })
);

/**
 * @desc    Get student's fee summary
 * @route   GET /api/v1/fees/student/:studentId/summary
 * @access  Private
 */
router.get('/student/:studentId/summary', asyncHandler(async (req, res) => {
  // Students can only view their own summary
  if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }
  
  // TODO: Implement with FeeInvoice model
  const mockSummary = {
    totalInvoices: 3,
    totalAmount: 7500.00,
    totalPaid: 2500.00,
    totalPending: 5000.00,
    totalOverdue: 1000.00,
    currency: 'USD',
    invoicesByStatus: {
      pending: 2,
      paid: 1,
      overdue: 0,
      partially_paid: 0,
    },
    upcomingPayments: [
      {
        invoiceNumber: 'INV-20241130-1001',
        amount: 2500.00,
        dueDate: '2024-12-31',
      },
    ],
  };
  
  successResponse(res, mockSummary, 'Fee summary retrieved successfully');
}));

/**
 * @desc    Get payment history for an invoice
 * @route   GET /api/v1/fees/:id/payments
 * @access  Private
 */
router.get('/:id/payments', asyncHandler(async (req, res) => {
  // TODO: Implement payment history tracking
  const mockPayments = [
    {
      id: '1',
      amount: 2500.00,
      paymentMethod: 'bank_transfer',
      transactionId: 'TXN123456789',
      paymentDate: '2024-11-15',
    },
  ];
  
  successResponse(res, mockPayments, 'Payment history retrieved successfully');
}));

/**
 * @desc    Delete fee invoice
 * @route   DELETE /api/v1/fees/:id
 * @access  Private (Admin only)
 */
router.delete('/:id', authorize('admin'), asyncHandler(async (req, res) => {
  // TODO: Implement with FeeInvoice model
  // Only allow deletion if no payments made
  successResponse(res, null, 'Fee invoice deleted successfully');
}));

/**
 * @desc    Generate fee report
 * @route   GET /api/v1/fees/reports/summary
 * @access  Private (Admin only)
 */
router.get('/reports/summary', authorize('admin'), asyncHandler(async (req, res) => {
  const { academicYear = '', semester = '', startDate = '', endDate = '' } = req.query;
  
  // TODO: Implement comprehensive fee reporting
  const mockReport = {
    totalRevenue: 125000.00,
    totalPending: 35000.00,
    totalOverdue: 8000.00,
    collectionRate: 78.5,
    currency: 'USD',
    byFeeType: {
      tuition: 100000.00,
      library: 10000.00,
      lab: 8000.00,
      sports: 5000.00,
      exam: 2000.00,
    },
    byStatus: {
      paid: 90000.00,
      pending: 35000.00,
      overdue: 8000.00,
      partially_paid: 7000.00,
    },
  };
  
  successResponse(res, mockReport, 'Fee report generated successfully');
}));

/**
 * @desc    Send payment reminder
 * @route   POST /api/v1/fees/:id/remind
 * @access  Private (Admin only)
 */
router.post('/:id/remind', authorize('admin'), asyncHandler(async (req, res) => {
  // TODO: Implement with FeeInvoice and Notification service
  // Send payment reminder email/SMS to student
  successResponse(res, null, 'Payment reminder sent successfully');
}));

module.exports = router;