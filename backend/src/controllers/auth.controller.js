const { asyncHandler } = require('../middlewares/error.middleware');
const authService = require('../services/auth.service');
const {
  successResponse,
  createdResponse,
  errorResponse,
} = require('../utils/response');

/**
 * @desc    Register a new student
 * @route   POST /api/v1/auth/register/student
 * @access  Public
 */
const registerStudent = asyncHandler(async (req, res) => {
  const result = await authService.registerStudent(req.body);
  
  createdResponse(res, result, 'Student registered successfully');
});

/**
 * @desc    Register a new teacher
 * @route   POST /api/v1/auth/register/teacher
 * @access  Public
 */
const registerTeacher = asyncHandler(async (req, res) => {
  const result = await authService.registerTeacher(req.body);
  
  createdResponse(res, result, 'Teacher registered successfully');
});

/**
 * @desc    Register a new admin
 * @route   POST /api/v1/auth/register/admin
 * @access  Admin only
 */
const registerAdmin = asyncHandler(async (req, res) => {
  const result = await authService.registerAdmin(req.body);
  
  createdResponse(res, result, 'Admin registered successfully');
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, userType } = req.body;
  
  if (!userType || !['student', 'teacher', 'admin'].includes(userType)) {
    return errorResponse(res, 'Invalid user type', 400);
  }
  
  const result = await authService.login(email, password, userType);
  
  successResponse(res, result, 'Login successful');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id, req.user.role);
  
  successResponse(res, profile, 'Profile retrieved successfully');
});

/**
 * @desc    Update password
 * @route   PUT /api/v1/auth/password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const result = await authService.updatePassword(
    req.user.id,
    req.user.role,
    currentPassword,
    newPassword
  );
  
  successResponse(res, result, 'Password updated successfully');
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  successResponse(res, null, 'Logout successful');
});

module.exports = {
  registerStudent,
  registerTeacher,
  registerAdmin,
  login,
  getProfile,
  updatePassword,
  logout,
};