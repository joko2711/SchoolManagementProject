const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define(
  'Course',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'course_code',
    },
    courseName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'course_name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'teacher_id',
    },
    semester: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      field: 'max_students',
    },
    enrolledStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'enrolled_students',
    },
    schedule: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    room: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'completed'),
      defaultValue: 'active',
    },
  },
  {
    tableName: 'courses',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Course;
