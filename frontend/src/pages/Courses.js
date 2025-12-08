import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import {
  School,
  Schedule,
  People,
  Room,
  ArrowBack,
  Person,
  ExitToApp,
} from '@mui/icons-material';
import courseService from '../services/courseService';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      console.log('API Response:', response);
      if (response.success) {
        // S'assurer que c'est bien un tableau
        const coursesData = Array.isArray(response.data) ? response.data : [];
        setCourses(coursesData);
      }
    } catch (error) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (courseId) => {
    alert(`Enrollment feature coming soon for course ${courseId}!`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvailabilityColor = (enrolled, max) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <School sx={{ ml: 2, mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Available Courses
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)' }}>
              <Person />
            </Avatar>
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold">
                  {courses.length}
                </Typography>
                <Typography variant="body1">Total Courses</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold">
                  {courses.filter(c => c.status === 'active').length}
                </Typography>
                <Typography variant="body1">Active Courses</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold">
                  {courses.reduce((sum, c) => sum + (c.credits || 0), 0)}
                </Typography>
                <Typography variant="body1">Total Credits</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {courses.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No courses available at the moment
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course.id}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {course.courseName}
                        </Typography>
                        <Chip label={course.courseCode} size="small" color="primary" sx={{ mb: 1 }} />
                      </Box>
                      <Chip
                        label={`${course.credits} Credits`}
                        size="small"
                        sx={{ bgcolor: '#f0f0f0', fontWeight: 'bold' }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {course.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {course.schedule}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Room fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {course.room}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {course.enrolledStudents}/{course.maxStudents} Students
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Availability
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" color={getAvailabilityColor(course.enrolledStudents, course.maxStudents) + '.main'}>
                          {((course.enrolledStudents / course.maxStudents) * 100).toFixed(0)}% Full
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(course.enrolledStudents / course.maxStudents) * 100}
                        color={getAvailabilityColor(course.enrolledStudents, course.maxStudents)}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>

                    <Chip
                      label={course.semester}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={course.enrolledStudents >= course.maxStudents}
                      onClick={() => handleEnroll(course.id)}
                    >
                      {course.enrolledStudents >= course.maxStudents ? 'Full' : 'Enroll Now'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Courses;
