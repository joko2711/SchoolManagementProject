import api from './api';

const authService = {
  // Inscription étudiant
  registerStudent: async (data) => {
    const response = await api.post('/auth/register/student', data);
    return response.data;
  },

  // Inscription teacher
  registerTeacher: async (data) => {
    const response = await api.post('/auth/register/teacher', data);
    return response.data;
  },

  // Connexion
  login: async (email, password, userType) => {
    const response = await api.post('/auth/login', {
      email,
      password,
      userType,
    });
    
    if (response.data.success) {
      const { tokens, user } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  // Récupérer le profil
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Vérifier si connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
