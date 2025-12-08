const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

// Log pour debug
console.log('Course Controller:', courseController);

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Development only - seed sample data
router.post('/seed/sample-data', courseController.seedCourses);

module.exports = router;
