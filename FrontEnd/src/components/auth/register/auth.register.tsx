'use client'
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    address: '',
  });

  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGenderChange = (event: any) => {
    setGender(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, gender }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const result = await response.json();
      // console.log('Registration successful:', result);
      if (result) {
        // console.log('Registration successful:', result);
        router.push('/auth/signin');
      }
      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <Box
      sx={{
        width: '80%',
        maxWidth: '600px',
        margin: '50px auto',
        padding: '40px',
        backgroundColor: '#FFF',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Box shadow effect
        borderRadius: '12px',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.2)', // Enhanced shadow on hover
        },
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
        Đăng ký tài khoản
      </Typography>

      <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 3, fontSize: '0.9rem', textAlign: 'center' }}>
        Bằng việc đăng ký, bạn đồng ý với các{' '}
        <a href="/terms" style={{ color: '#FF5722' }}>
          Điều khoản dịch vụ
        </a>{' '}
        và{' '}
        <a href="/privacy" style={{ color: '#FF5722' }}>
          Chính sách quyền riêng tư
        </a>{' '}
        của chúng tôi.
      </Typography>

      {/* Google Sign Up */}
      {/* <Button
        variant="outlined"
        startIcon={<GoogleIcon />}
        fullWidth
        sx={{
          color: '#FF5722',
          borderColor: '#FF5722',
          mb: 3,
          transition: 'background-color 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: '#FF5722',
            color: '#FFF',
          },
        }}
      >
        Đăng ký bằng Google
      </Button> */}

      {/* <Typography sx={{ textAlign: 'center', mb: 2, fontSize: '0.9rem' }}>HOẶC</Typography> */}

      {/* Registration Fields */}
      <TextField
        label="Họ và Tên"
        variant="outlined"
        fullWidth
        required
        name="name"
        value={formData.name}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        required
        name="email"
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Mật khẩu"
        variant="outlined"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        required
        name="password"
        value={formData.password}
        onChange={handleChange}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <Button onClick={handleTogglePassword}>
              {showPassword ? 'Ẩn' : 'Hiện'}
            </Button>
          ),
        }}
      />
      <TextField
        label="Tuổi"
        variant="outlined"
        fullWidth
        required
        name="age"
        value={formData.age}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Địa chỉ"
        variant="outlined"
        fullWidth
        required
        name="address"
        value={formData.address}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      {/* Gender Selection */}
      <Select
        labelId="gender-label"
        value={gender}
        onChange={handleGenderChange}
        displayEmpty
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>Chọn Giới Tính</em>
        </MenuItem>
        <MenuItem value="male">Nam</MenuItem>
        <MenuItem value="female">Nữ</MenuItem>
        <MenuItem value="other">Khác</MenuItem>
      </Select>

      {/* Checkbox for Terms and Privacy */}
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label="Tôi đã đọc và đồng ý với các Điều khoản dịch vụ và Chính sách quyền riêng tư"
        sx={{ mb: 2 }}
      />

      {/* Register Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 3,
          py: 1.5,
          backgroundColor: '#FF5722',
          borderRadius: '30px',
          transition: 'background-color 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: '#E64A19',
          },
        }}
        onClick={handleSubmit}
      >
        Đăng ký bằng Email
      </Button>

      <Typography
        sx={{ mt: 3, textAlign: 'center', color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.9rem' }}
      >
        Bạn đã có tài khoản?{' '}
        <a href="/auth/signin" style={{ color: '#FF5722', textDecoration: 'none' }}>
          Đăng nhập ngay!
        </a>
      </Typography>
    </Box>
  );
}