const express = require('express');
const { body } = require('express-validator');
const {
  registerStudent,
  registerTeacher,
  registerAdmin,
  login,
  getProfile,
  updatePassword,
  logout,
} = require('../controllers/auth.controller');
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');

const router = express.Router();

// Validation rules
const registerStudentValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required'),
];

const registerTeacherValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('department').optional().trim(),
  body('specialization').optional().trim(),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('userType')
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('User type must be student, teacher, or admin'),
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];

// Public routes
router.post(
  '/register/student',
  registerStudentValidation,
  validate,
  registerStudent
);

router.post(
  '/register/teacher',
  registerTeacherValidation,
  validate,
  registerTeacher
);

router.post(
  '/login',
  loginValidation,
  validate,
  login
);

// Protected routes
router.use(authMiddleware);

router.get('/profile', getProfile);

router.put(
  '/password',
  updatePasswordValidation,
  validate,
  updatePassword
);

router.post('/logout', logout);

// Admin only route
router.post(
  '/register/admin',
  authorize('super_admin', 'admin'),
  registerTeacherValidation,
  validate,
  registerAdmin
);

module.exports = router;
