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
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  ExitToApp,
  Payment,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Fees = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePayment = (fee) => {
    setSelectedFee(fee);
    setPaymentDialog(true);
  };

  const handlePaymentSubmit = () => {
    alert(`Payment of $${selectedFee.amount} processed successfully!`);
    setPaymentDialog(false);
  };

  // Mock data
  const feeRecords = [
    { id: 1, type: 'Tuition Fee', semester: 'Fall 2025', amount: 5000, paid: 5000, dueDate: '2025-09-01', status: 'paid' },
    { id: 2, type: 'Lab Fee', semester: 'Fall 2025', amount: 300, paid: 300, dueDate: '2025-09-15', status: 'paid' },
    { id: 3, type: 'Library Fee', semester: 'Fall 2025', amount: 100, paid: 0, dueDate: '2025-12-15', status: 'pending' },
    { id: 4, type: 'Activity Fee', semester: 'Fall 2025', amount: 200, paid: 0, dueDate: '2025-12-20', status: 'pending' },
    { id: 5, type: 'Technology Fee', semester: 'Fall 2025', amount: 250, paid: 0, dueDate: '2025-11-30', status: 'overdue' },
  ];

  const totalFees = feeRecords.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = feeRecords.reduce((sum, fee) => sum + fee.paid, 0);
  const totalPending = totalFees - totalPaid;

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle />;
      case 'pending':
        return <Warning />;
      case 'overdue':
        return <Error />;
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
          <Payment sx={{ ml: 2, mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fee Management
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
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  ${totalFees.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Fees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  ${totalPaid.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Amount Paid
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  ${totalPending.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Amount Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Fee Table */}
        <Paper elevation={3}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" fontWeight="bold">
              💳 Fee Records
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Fee Type</strong></TableCell>
                  <TableCell><strong>Semester</strong></TableCell>
                  <TableCell align="right"><strong>Amount</strong></TableCell>
                  <TableCell align="right"><strong>Paid</strong></TableCell>
                  <TableCell><strong>Due Date</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feeRecords.map((fee) => (
                  <TableRow key={fee.id} hover>
                    <TableCell>{fee.type}</TableCell>
                    <TableCell>{fee.semester}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">${fee.amount}</Typography>
                    </TableCell>
                    <TableCell align="right">${fee.paid}</TableCell>
                    <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={getStatusIcon(fee.status)}
                        label={fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                        color={getStatusColor(fee.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {fee.status !== 'paid' && (
                        <Button
                          variant="contained"
                          size="small"
                          color={fee.status === 'overdue' ? 'error' : 'primary'}
                          onClick={() => handlePayment(fee)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Fee Type"
              value={selectedFee?.type || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Amount"
              value={`$${selectedFee?.amount || 0}`}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Payment Method"
              defaultValue="card"
              sx={{ mb: 2 }}
            >
              <MenuItem value="card">Credit/Debit Card</MenuItem>
              <MenuItem value="bank">Bank Transfer</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  placeholder="123"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePaymentSubmit}>
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Fees;
