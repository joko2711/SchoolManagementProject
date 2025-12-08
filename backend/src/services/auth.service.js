const { Student, User } = require('../models');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Generate token pair (access + refresh)
 */
const generateTokenPair = (payload) => {
  const accessToken = generateToken(payload);
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
  
  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Register a new student
 */
const registerStudent = async (data) => {
  const { firstName, lastName, email, password, phone, dateOfBirth, address, parentName, parentEmail, parentPhone } = data;

  // Check if email already exists
  const existingStudent = await Student.findOne({ where: { email } });
  if (existingStudent) {
    throw new Error('Email already registered');
  }

  // Generate unique student ID (shorter format)
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  const studentId = `STU-${timestamp}${random}`;

  // Create student
  const student = await Student.create({
    studentId,
    firstName,
    lastName,
    email,
    password,
    phone,
    dateOfBirth,
    address,
    parentName,
    parentEmail,
    parentPhone,
    enrollmentDate: new Date(),
  });

  // Generate tokens
  const tokens = generateTokenPair({
    id: student.id,
    email: student.email,
    role: 'student',
  });

  return {
    user: student.toJSON(),
    tokens,
  };
};

/**
 * Register a new teacher
 */
const registerTeacher = async (data) => {
  const { firstName, lastName, email, password, phone } = data;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  const userId = `TCH-${timestamp}${random}`;

  const teacher = await User.create({
    userId,
    firstName,
    lastName,
    email,
    password,
    phone,
    role: 'teacher',
  });

  const tokens = generateTokenPair({
    id: teacher.id,
    email: teacher.email,
    role: 'teacher',
  });

  return {
    user: teacher.toJSON(),
    tokens,
  };
};

/**
 * Register a new admin
 */
const registerAdmin = async (data) => {
  const { firstName, lastName, email, password, phone } = data;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  const userId = `ADM-${timestamp}${random}`;

  const admin = await User.create({
    userId,
    firstName,
    lastName,
    email,
    password,
    phone,
    role: 'admin',
  });

  const tokens = generateTokenPair({
    id: admin.id,
    email: admin.email,
    role: 'admin',
  });

  return {
    user: admin.toJSON(),
    tokens,
  };
};

/**
 * Login user (student, teacher, or admin)
 */
const login = async (email, password, userType) => {
  let user;

  // Find user based on type
  if (userType === 'student') {
    user = await Student.findOne({ where: { email } });
  } else {
    user = await User.findOne({ where: { email, role: userType } });
  }

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if account is active
  if (user.status !== 'active') {
    throw new Error('Account is not active');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Update last login for non-students
  if (user.updateLastLogin) {
    await user.updateLastLogin();
  }

  // Generate tokens
  const tokens = generateTokenPair({
    id: user.id,
    email: user.email,
    role: userType,
  });

  return {
    user: user.toJSON(),
    tokens,
  };
};

/**
 * Get user profile by ID and type
 */
const getProfile = async (userId, userType) => {
  let user;

  if (userType === 'student') {
    user = await Student.findByPk(userId);
  } else {
    user = await User.findByPk(userId);
  }

  if (!user) {
    throw new Error('User not found');
  }

  return user.toJSON();
};

/**
 * Update user password
 */
const updatePassword = async (userId, userType, currentPassword, newPassword) => {
  let user;

  if (userType === 'student') {
    user = await Student.findByPk(userId);
  } else {
    user = await User.findByPk(userId);
  }

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return { message: 'Password updated successfully' };
};

module.exports = {
  registerStudent,
  registerTeacher,
  registerAdmin,
  login,
  getProfile,
  updatePassword,
  generateToken,
  generateTokenPair,
};
