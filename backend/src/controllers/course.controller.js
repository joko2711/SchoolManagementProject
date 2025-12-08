const { Course } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const getAllCourses = async (req, res) => {
  try {
    const { status, semester } = req.query;
    const where = {};
    if (status) where.status = status;
    if (semester) where.semester = semester;
    const courses = await Course.findAll({ where, order: [['courseName', 'ASC']] });
    return successResponse(res, courses, 'Courses retrieved successfully');
  } catch (error) {
    console.error('Get courses error:', error);
    return errorResponse(res, error.message, 500);
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) return errorResponse(res, 'Course not found', 404);
    return successResponse(res, course, 'Course retrieved successfully');
  } catch (error) {
    console.error('Get course error:', error);
    return errorResponse(res, error.message, 500);
  }
};

const createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const course = await Course.create(courseData);
    return successResponse(res, course, 'Course created successfully', 201);
  } catch (error) {
    console.error('Create course error:', error);
    return errorResponse(res, error.message, 500);
  }
};

const seedCourses = async (req, res) => {
  try {
    const sampleCourses = [
      { courseCode: 'CS101', courseName: 'Introduction to Computer Science', description: 'Learn the fundamentals of programming', credits: 4, semester: 'Fall 2025', maxStudents: 40, enrolledStudents: 35, schedule: 'Mon, Wed, Fri - 9:00 AM', room: 'CS Building, Room 101', status: 'active' },
      { courseCode: 'MATH201', courseName: 'Calculus II', description: 'Advanced calculus covering integration', credits: 4, semester: 'Fall 2025', maxStudents: 35, enrolledStudents: 30, schedule: 'Tue, Thu - 10:30 AM', room: 'Math Building, Room 205', status: 'active' },
      { courseCode: 'ENG110', courseName: 'English Composition', description: 'Develop writing skills', credits: 3, semester: 'Fall 2025', maxStudents: 25, enrolledStudents: 20, schedule: 'Mon, Wed - 2:00 PM', room: 'Liberal Arts, Room 310', status: 'active' },
      { courseCode: 'PHYS150', courseName: 'General Physics I', description: 'Introduction to mechanics', credits: 4, semester: 'Fall 2025', maxStudents: 30, enrolledStudents: 28, schedule: 'Tue, Thu - 1:00 PM', room: 'Science Building, Room 150', status: 'active' },
      { courseCode: 'HIST101', courseName: 'World History', description: 'Survey of world civilizations', credits: 3, semester: 'Fall 2025', maxStudents: 50, enrolledStudents: 45, schedule: 'Mon, Wed - 11:00 AM', room: 'Humanities, Room 220', status: 'active' },
      { courseCode: 'BIO120', courseName: 'General Biology', description: 'Introduction to biology', credits: 4, semester: 'Fall 2025', maxStudents: 35, enrolledStudents: 32, schedule: 'Tue, Thu - 9:00 AM', room: 'Biology Lab, Room 105', status: 'active' },
      { courseCode: 'CHEM101', courseName: 'General Chemistry', description: 'Fundamental chemistry', credits: 4, semester: 'Fall 2025', maxStudents: 30, enrolledStudents: 25, schedule: 'Mon, Wed, Fri - 10:00 AM', room: 'Chemistry Lab, Room 201', status: 'active' },
      { courseCode: 'PSYCH100', courseName: 'Introduction to Psychology', description: 'Overview of psychology', credits: 3, semester: 'Fall 2025', maxStudents: 60, enrolledStudents: 55, schedule: 'Tue, Thu - 2:30 PM', room: 'Social Sciences, Room 180', status: 'active' }
    ];
    await Course.destroy({ where: {} });
    const courses = await Course.bulkCreate(sampleCourses);
    return successResponse(res, courses, 'Sample courses created successfully', 201);
  } catch (error) {
    console.error('Seed courses error:', error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, seedCourses };
