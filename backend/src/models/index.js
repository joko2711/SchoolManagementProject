const { sequelize } = require('../config/database');
const Student = require('./Student.model');
const User = require('./User.model');
const Course = require('./Course.model');

// Define associations here if needed
// Student.hasMany(Enrollment);
// Course.hasMany(Enrollment);

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Student,
  User,
  Course,
  syncDatabase,
};
