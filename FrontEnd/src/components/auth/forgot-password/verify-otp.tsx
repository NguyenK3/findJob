import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

const VerifyOtp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    const response = await fetch('http://localhost:8000/api/v1/password-reset/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    if (response.ok) {
      router.push('/auth/reset-password');
    } else {
      alert('Xác minh OTP thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7f9fc',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Xác Minh OTP
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
          Vui lòng nhập email và mã OTP mà bạn đã nhận để tiếp tục.
        </Typography>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleVerify}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Xác Minh
        </Button>
      </Paper>
    </Box>
  );
};

export default VerifyOtp;