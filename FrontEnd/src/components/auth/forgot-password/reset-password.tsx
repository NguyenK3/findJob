import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleReset = async () => {
    // Kiểm tra độ mạnh của mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      console.log('Mật khẩu yếu');
      alert('Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt.');
      return;
    }

    const response = await fetch('http://localhost:8000/api/v1/password-reset/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, otp }),
    });
    if (response.ok) {
      alert('Đặt lại mật khẩu thành công!');
      router.push('/auth/signin');
    } else {
      alert('Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Đặt Lại Mật Khẩu
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
          Vui lòng nhập email, mã OTP và mật khẩu mới để đặt lại mật khẩu.
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
        <TextField
          label="Mật Khẩu Mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleReset}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Đặt Lại Mật Khẩu
        </Button>
      </Paper>
    </Box>
  );
};

export default ResetPassword;