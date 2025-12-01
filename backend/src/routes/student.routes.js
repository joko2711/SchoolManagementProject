const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../middlewares/error.middleware');
const { Student } = require('../models');
const { successResponse, paginatedResponse, notFoundResponse } = require('../utils/response');

// All routes require authentication
router.use(authMiddleware);

/**
 * @desc    Get all students
 * @route   GET /api/v1/students
 * @access  Private (Admin, Teacher)
 */
router.get('/', authorize('admin', 'teacher'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', status = '' } = req.query;
  
  const where = {};
  
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { studentId: { [Op.iLike]: `%${search}%` } },
    ];
  }
  
  if (status) {
    where.status = status;
  }
  
  const offset = (page - 1) * limit;
  
  const { count, rows } = await Student.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });
  
  paginatedResponse(res, rows, page, limit, count, 'Students retrieved successfully');
}));

/**
 * @desc    Get student by ID
 * @route   GET /api/v1/students/:id
 * @access  Private
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  
  if (!student) {
    return notFoundResponse(res, 'Student not found');
  }
  
  // Students can only view their own profile, unless admin/teacher
  if (req.user.role === 'student' && req.user.id !== student.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }
  
  successResponse(res, student, 'Student retrieved successfully');
}));

/**
 * @desc    Update student
 * @route   PUT /api/v1/students/:id
 * @access  Private
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  
  if (!student) {
    return notFoundResponse(res, 'Student not found');
  }
  
  // Students can only update their own profile, unless admin
  if (req.user.role === 'student' && req.user.id !== student.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }
  
  const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'profileImage'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  
  await student.update(updates);
  
  successResponse(res, student, 'Student updated successfully');
}));

/**
 * @desc    Delete student (soft delete)
 * @route   DELETE /api/v1/students/:id
 * @access  Private (Admin only)
 */
router.delete('/:id', authorize('admin'), asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  
  if (!student) {
    return notFoundResponse(res, 'Student not found');
  }
  
  await student.destroy();
  
  successResponse(res, null, 'Student deleted successfully');
}));

module.exports = router;