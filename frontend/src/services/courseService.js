import api from './api';

const courseService = {
  // Récupérer tous les cours
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  // Récupérer un cours par ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Créer un nouveau cours
  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },
};

export default courseService;
