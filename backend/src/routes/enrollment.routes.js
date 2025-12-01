const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../middlewares/error.middleware');
const { successResponse, paginatedResponse, notFoundResponse, createdResponse, conflictResponse } = require('../utils/response');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// All routes require authentication
router.use(authMiddleware);

/**
 * @desc    Get all enrollments (Admin/Teacher view all, Student view own)
 * @route   GET /api/v1/enrollments
 * @access  Private
 */
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, studentId = '', courseId = '', status = '' } = req.query;
  
  // Students can only see their own enrollments
  const queryStudentId = req.user.role === 'student' ? req.user.id : studentId;
  
  // TODO: Implement with Enrollment model
  const mockEnrollments = [
    {
      id: '1',
      studentId: queryStudentId || 'student-uuid',
      studentName: 'John Doe',
      courseId: 'course-uuid-1',
      courseName: 'Introduction to Computer Science',
      courseCode: 'CS101',
      enrollmentDate: '2024-01-15',
      status: 'enrolled',
      grade: null,
      attendancePercentage: 85,
    },
  ];
  
  paginatedResponse(res, mockEnrollments, page, limit, mockEnrollments.length, 'Enrollments retrieved successfully');
}));

/**
 * @desc    Get enrollment by ID
 * @route   GET /api/v1/enrollments/:id
 * @access  Private
 */
router.get('/:id', asyncHandler(async (req, res) => {
  // TODO: Implement with Enrollment model
  const mockEnrollment = {
    id: req.params.id,
    studentId: 'student-uuid',
    studentName: 'John Doe',
    courseId: 'course-uuid',
    courseName: 'Introduction to Computer Science',
    courseCode: 'CS101',
    enrollmentDate: '2024-01-15',
    status: 'enrolled',
    grade: null,
    midtermScore: 85,
    finalScore: 90,
    totalScore: 88,
    attendancePercentage: 92,
  };
  
  // Students can only view their own enrollments
  if (req.user.role === 'student' && req.user.id !== mockEnrollment.studentId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }
  
  successResponse(res, mockEnrollment, 'Enrollment retrieved successfully');
}));

/**
 * @desc    Enroll in a course
 * @route   POST /api/v1/enrollments
 * @access  Private (Student)
 */
router.post(
  '/',
  authorize('student', 'admin'),
  [
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('studentId').optional(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { courseId, studentId } = req.body;
    
    // Use authenticated user's ID if not provided (or if not admin)
    const enrollStudentId = req.user.role === 'admin' && studentId ? studentId : req.user.id;
    
    // TODO: Implement with Course and Enrollment models
    // 1. Check if course exists and has available seats
    // 2. Check if student is already enrolled
    // 3. Check prerequisites
    // 4. Create enrollment
    // 5. Send notification
    
    const mockEnrollment = {
      id: 'new-enrollment-uuid',
      studentId: enrollStudentId,
      courseId,
      enrollmentDate: new Date(),
      status: 'enrolled',
    };
    
    createdResponse(res, mockEnrollment, 'Successfully enrolled in course');
  })
);

/**
 * @desc    Update enrollment (grades, status)
 * @route   PUT /api/v1/enrollments/:id
 * @access  Private (Teacher, Admin)
 */
router.put(
  '/:id',
  authorize('teacher', 'admin'),
  asyncHandler(async (req, res) => {
    const { midtermScore, finalScore, grade, status, remarks } = req.body;
    
    // TODO: Implement with Enrollment model
    // 1. Find enrollment
    // 2. Update scores and calculate total
    // 3. Assign grade if applicable
    // 4. Send notification to student
    
    const mockEnrollment = {
      id: req.params.id,
      midtermScore,
      finalScore,
      totalScore: midtermScore && finalScore ? (midtermScore * 0.4 + finalScore * 0.6) : null,
      grade,
      status,
      remarks,
    };
    
    successResponse(res, mockEnrollment, 'Enrollment updated successfully');
  })
);

/**
 * @desc    Drop a course (withdraw from enrollment)
 * @route   DELETE /api/v1/enrollments/:id
 * @access  Private (Student for own, Admin for any)
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  // TODO: Implement with Enrollment model
  // 1. Find enrollment
  // 2. Check if student owns this enrollment (unless admin)
  // 3. Check if withdrawal is allowed (deadline not passed)
  // 4. Update status to 'dropped' or 'withdrawn'
  // 5. Decrease course enrollment count
  // 6. Send notification
  
  successResponse(res, null, 'Successfully dropped from course');
}));

/**
 * @desc    Get student's current enrollments
 * @route   GET /api/v1/enrollments/my/courses
 * @access  Private (Student)
 */
router.get('/my/courses', authorize('student'), asyncHandler(async (req, res) => {
  const { semester = '', status = 'enrolled' } = req.query;
  
  // TODO: Implement with Enrollment model
  const mockEnrollments = [
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      credits: 3,
      teacherName: 'Dr. Smith',
      schedule: 'Mon/Wed 9:00-10:30',
      status: 'enrolled',
    },
  ];
  
  successResponse(res, mockEnrollments, 'Your enrollments retrieved successfully');
}));

/**
 * @desc    Get enrollment statistics for a course
 * @route   GET /api/v1/enrollments/course/:courseId/stats
 * @access  Private (Teacher, Admin)
 */
router.get('/course/:courseId/stats', authorize('teacher', 'admin'), asyncHandler(async (req, res) => {
  // TODO: Implement with Enrollment model
  const mockStats = {
    totalEnrolled: 25,
    maxCapacity: 30,
    averageGrade: 'B+',
    averageAttendance: 88.5,
    gradeDistribution: {
      'A': 5,
      'B': 12,
      'C': 6,
      'D': 2,
      'F': 0,
    },
  };
  
  successResponse(res, mockStats, 'Course enrollment statistics retrieved successfully');
}));

module.exports = router;