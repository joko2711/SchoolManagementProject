import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardContent,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  ExitToApp,
  CheckCircle,
  Cancel,
  EventAvailable,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data
  const attendanceRecords = [
    { id: 1, course: 'Introduction to Computer Science', date: '2025-12-08', status: 'present', time: '9:00 AM' },
    { id: 2, course: 'Calculus II', date: '2025-12-08', status: 'present', time: '10:30 AM' },
    { id: 3, course: 'English Composition', date: '2025-12-07', status: 'present', time: '2:00 PM' },
    { id: 4, course: 'General Physics I', date: '2025-12-07', status: 'absent', time: '1:00 PM' },
    { id: 5, course: 'Introduction to Computer Science', date: '2025-12-06', status: 'present', time: '9:00 AM' },
    { id: 6, course: 'Calculus II', date: '2025-12-06', status: 'present', time: '10:30 AM' },
    { id: 7, course: 'General Physics I', date: '2025-12-05', status: 'present', time: '1:00 PM' },
    { id: 8, course: 'English Composition', date: '2025-12-05', status: 'late', time: '2:00 PM' },
  ];

  const stats = {
    totalClasses: 8,
    present: 6,
    absent: 1,
    late: 1,
    attendanceRate: 87.5,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle />;
      case 'absent':
        return <Cancel />;
      case 'late':
        return <EventAvailable />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <EventAvailable sx={{ ml: 2, mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Attendance
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
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stats.totalClasses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Classes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.present}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {stats.absent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats.late}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Late
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Rate */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Overall Attendance Rate
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {stats.attendanceRate}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stats.attendanceRate}
            color="success"
            sx={{ height: 10, borderRadius: 1 }}
          />
        </Paper>

        {/* Attendance Table */}
        <Paper elevation={3}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" fontWeight="bold">
              📅 Attendance History
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Course</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.course}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={getStatusIcon(record.status)}
                        label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default Attendance;
