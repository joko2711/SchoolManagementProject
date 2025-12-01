const { sequelize } = require('../config/database');

// Import Student model
const Student = require('./Student.model');
const User = require('./User.model');

// Définir les associations si nécessaire
// Exemple: Student.hasMany(Enrollment, { foreignKey: 'studentId' });

// Sync database
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Student,
  User,
  syncDatabase,
};