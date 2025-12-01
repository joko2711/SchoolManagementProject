const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../middlewares/error.middleware');
const { User } = require('../models');
const { successResponse, paginatedResponse, notFoundResponse } = require('../utils/response');
const { Op } = require('sequelize');

// All routes require authentication
router.use(authMiddleware);

/**
 * @desc    Get all teachers
 * @route   GET /api/v1/teachers
 * @access  Private
 */
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', department = '' } = req.query;
  
  const where = { role: 'teacher' };
  
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  
  const offset = (page - 1) * limit;
  
  const { count, rows } = await User.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
  });
  
  paginatedResponse(res, rows, page, limit, count, 'Teachers retrieved successfully');
}));

/**
 * @desc    Get teacher by ID
 * @route   GET /api/v1/teachers/:id
 * @access  Private
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const teacher = await User.findOne({
    where: { 
      id: req.params.id,
      role: 'teacher'
    },
    attributes: { exclude: ['password'] },
  });
  
  if (!teacher) {
    return notFoundResponse(res, 'Teacher not found');
  }
  
  successResponse(res, teacher, 'Teacher retrieved successfully');
}));

/**
 * @desc    Update teacher
 * @route   PUT /api/v1/teachers/:id
 * @access  Private (Teacher can update own profile, Admin can update any)
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const teacher = await User.findOne({
    where: { 
      id: req.params.id,
      role: 'teacher'
    }
  });
  
  if (!teacher) {
    return notFoundResponse(res, 'Teacher not found');
  }
  
  // Teachers can only update their own profile, unless admin
  if (req.user.role === 'teacher' && req.user.id !== teacher.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }
  
  const allowedFields = ['firstName', 'lastName', 'phone', 'profileImage'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  
  await teacher.update(updates);
  
  successResponse(res, teacher, 'Teacher updated successfully');
}));

/**
 * @desc    Delete teacher (soft delete)
 * @route   DELETE /api/v1/teachers/:id
 * @access  Private (Admin only)
 */
router.delete('/:id', authorize('admin'), asyncHandler(async (req, res) => {
  const teacher = await User.findOne({
    where: { 
      id: req.params.id,
      role: 'teacher'
    }
  });
  
  if (!teacher) {
    return notFoundResponse(res, 'Teacher not found');
  }
  
  await teacher.destroy();
  
  successResponse(res, null, 'Teacher deleted successfully');
}));

/**
 * @desc    Get teacher's schedule
 * @route   GET /api/v1/teachers/:id/schedule
 * @access  Private
 */
router.get('/:id/schedule', asyncHandler(async (req, res) => {
  // TODO: Implement when Course and Schedule models are ready
  successResponse(res, [], 'Teacher schedule retrieved successfully');
}));

/**
 * @desc    Get teacher's courses
 * @route   GET /api/v1/teachers/:id/courses
 * @access  Private
 */
router.get('/:id/courses', asyncHandler(async (req, res) => {
  // TODO: Implement when Course model is ready
  successResponse(res, [], 'Teacher courses retrieved successfully');
}));

module.exports = router;