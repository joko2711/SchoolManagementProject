import React from 'react';
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
  Assessment,
  Grade,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Grades = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data
  const grades = [
    { id: 1, course: 'Introduction to Computer Science', code: 'CS101', grade: 'A', score: 92, credits: 4, status: 'completed' },
    { id: 2, course: 'Calculus II', code: 'MATH201', grade: 'B+', score: 88, credits: 4, status: 'completed' },
    { id: 3, course: 'English Composition', code: 'ENG110', grade: 'A-', score: 90, credits: 3, status: 'completed' },
    { id: 4, course: 'General Physics I', code: 'PHYS150', grade: 'B', score: 85, credits: 4, status: 'in-progress' },
    { id: 5, course: 'World History', code: 'HIST101', grade: 'A', score: 94, credits: 3, status: 'completed' },
    { id: 6, course: 'General Biology', code: 'BIO120', grade: 'B+', score: 87, credits: 4, status: 'in-progress' },
  ];

  const gpa = 3.65;
  const totalCredits = 22;
  const completedCredits = 14;

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'warning';
    return 'error';
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'success' : 'warning';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Assessment sx={{ ml: 2, mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Grades
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
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {gpa.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      Current GPA
                    </Typography>
                  </Box>
                  <Grade sx={{ fontSize: 60, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {completedCredits}/{totalCredits}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Credits Earned
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(completedCredits / totalCredits) * 100}
                  sx={{ mt: 2, height: 8, borderRadius: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {grades.filter(g => g.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Courses Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Grades Table */}
        <Paper elevation={3}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" fontWeight="bold">
              📊 Course Grades
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Course Code</strong></TableCell>
                  <TableCell><strong>Course Name</strong></TableCell>
                  <TableCell align="center"><strong>Credits</strong></TableCell>
                  <TableCell align="center"><strong>Score</strong></TableCell>
                  <TableCell align="center"><strong>Grade</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id} hover>
                    <TableCell>
                      <Chip label={grade.code} size="small" color="primary" />
                    </TableCell>
                    <TableCell>{grade.course}</TableCell>
                    <TableCell align="center">{grade.credits}</TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold">{grade.score}%</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={grade.grade}
                        color={getGradeColor(grade.grade)}
                        sx={{ fontWeight: 'bold', fontSize: '1rem', minWidth: 50 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={grade.status === 'completed' ? 'Completed' : 'In Progress'}
                        color={getStatusColor(grade.status)}
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

export default Grades;
