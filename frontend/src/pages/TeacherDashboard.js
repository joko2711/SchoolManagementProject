import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  School,
  People,
  Assignment,
  CheckCircle,
  ExitToApp,
  Class,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const stats = [
    { title: 'My Courses', value: '5', icon: <School fontSize="large" />, color: '#1976d2' },
    { title: 'Total Students', value: '120', icon: <People fontSize="large" />, color: '#2e7d32' },
    { title: 'Classes Today', value: '3', icon: <Class fontSize="large" />, color: '#ed6c02' },
    { title: 'Pending Grades', value: '8', icon: <Assignment fontSize="large" />, color: '#d32f2f' },
  ];

  // Mock data for courses
  const myCourses = [
    { id: 1, name: 'Mathematics 101', code: 'MATH101', students: 30, schedule: 'Mon, Wed, Fri - 9:00 AM' },
    { id: 2, name: 'Advanced Calculus', code: 'MATH201', students: 25, schedule: 'Tue, Thu - 10:30 AM' },
    { id: 3, name: 'Statistics', code: 'STAT101', students: 28, schedule: 'Mon, Wed - 2:00 PM' },
    { id: 4, name: 'Linear Algebra', code: 'MATH301', students: 20, schedule: 'Tue, Thu - 1:00 PM' },
    { id: 5, name: 'Discrete Math', code: 'MATH102', students: 17, schedule: 'Fri - 11:00 AM' },
  ];

  // Mock data for today's classes
  const todayClasses = [
    { course: 'Mathematics 101', time: '9:00 AM - 10:30 AM', room: 'Room 201', status: 'upcoming' },
    { course: 'Statistics', time: '2:00 PM - 3:30 PM', room: 'Room 105', status: 'upcoming' },
    { course: 'Discrete Math', time: '11:00 AM - 12:30 PM', room: 'Room 304', status: 'completed' },
  ];

  // Mock data for recent attendance
  const recentAttendance = [
    { course: 'Mathematics 101', date: '2025-12-08', present: 28, absent: 2, total: 30 },
    { course: 'Advanced Calculus', date: '2025-12-07', present: 24, absent: 1, total: 25 },
    { course: 'Statistics', date: '2025-12-06', present: 27, absent: 1, total: 28 },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'white', color: '#2e7d32', width: 56, height: 56 }}>
                👨‍🏫
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Welcome, Prof. {user?.firstName} {user?.lastName}!
                </Typography>
                <Typography variant="body2">
                  {user?.email} | Teacher Dashboard
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Content */}
      <Container maxWidth="lg">
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color={stat.color}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="My Courses" />
            <Tab label="Today's Schedule" />
            <Tab label="Recent Attendance" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {myCourses.map((course) => (
              <Grid item xs={12} md={6} key={course.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {course.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.code}
                        </Typography>
                      </Box>
                      <Chip label={`${course.students} Students`} color="primary" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {course.schedule}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outlined" size="small" fullWidth>
                        Take Attendance
                      </Button>
                      <Button variant="outlined" size="small" fullWidth>
                        Grade Students
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Course</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Room</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todayClasses.map((cls, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{cls.course}</TableCell>
                    <TableCell>{cls.time}</TableCell>
                    <TableCell>{cls.room}</TableCell>
                    <TableCell>
                      <Chip
                        label={cls.status === 'completed' ? 'Completed' : 'Upcoming'}
                        color={cls.status === 'completed' ? 'success' : 'warning'}
                        size="small"
                        icon={cls.status === 'completed' ? <CheckCircle /> : <Schedule />}
                      />
                    </TableCell>
                    <TableCell>
                      {cls.status === 'upcoming' && (
                        <Button variant="contained" size="small">
                          Start Class
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 2 && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Course</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>Present</strong></TableCell>
                  <TableCell align="center"><strong>Absent</strong></TableCell>
                  <TableCell align="center"><strong>Total</strong></TableCell>
                  <TableCell align="center"><strong>Attendance %</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentAttendance.map((record, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{record.course}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Chip label={record.present} color="success" size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={record.absent} color="error" size="small" />
                    </TableCell>
                    <TableCell align="center">{record.total}</TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold" color="success.main">
                        {((record.present / record.total) * 100).toFixed(1)}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default TeacherDashboard;
