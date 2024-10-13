'use client'

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // Ensure you have this import

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        width: "80%",
        maxWidth: "1000px",
        margin: "50px auto",
        p: 4,
        backgroundColor: "#FFF",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Box shadow effect
        borderRadius: "12px",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
        },
      }}
    >
      {/* Left Side - Login Form */}
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Chào mừng bạn đến với KabaNoPro
        </Typography>
        <Typography
          sx={{
            color: "rgba(0, 0, 0, 0.7)",
            mb: 2,
            fontSize: "0.9rem",
          }}
        >
          Bằng việc đăng nhập, bạn đồng ý với các{" "}
          <a href="/terms" style={{ color: "#FF5722" }}>
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="/privacy" style={{ color: "#FF5722" }}>
            Chính sách quyền riêng tư
          </a>{" "}
          của KabaNoPro.
        </Typography>

        {/* Google Login Button */}
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            color: "#FF5722",
            borderColor: "#FF5722",
            mb: 3,
            transition: "background-color 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#FF5722",
              color: "#FFF",
            },
          }}
        >
          Đăng nhập bằng Google
        </Button>

        <Typography sx={{ mb: 2, textAlign: "center", fontSize: "0.9rem" }}>
          hoặc
        </Typography>

        {/* Email and Password Fields */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mật khẩu"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <Button onClick={handleTogglePassword}>
                {showPassword ? "Ẩn" : "Hiện"}
              </Button>
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Ghi nhớ tài khoản"
          />
          <a
            href="/forgot-password"
            style={{ color: "#FF5722", textDecoration: "none" }}
          >
            Quên mật khẩu?
          </a>
        </Box>

        {/* Login Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: "#FF5722",
            borderRadius: "30px",
            transition: "background-color 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#E64A19",
            },
          }}
        >
          Đăng nhập bằng Email
        </Button>

        <Typography
          sx={{
            mt: 3,
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.7)",
            fontSize: "0.9rem",
          }}
        >
          Bạn chưa có tài khoản?{" "}
          <a
            href="/register"
            style={{ color: "#FF5722", textDecoration: "none" }}
          >
            Đăng ký ngay
          </a>
        </Typography>
      </Box>

      {/* Right Side - Info Section */}
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          textAlign: { xs: "center", sm: "left" },
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Đăng nhập để truy cập ngay vào hàng ngàn đánh giá và dữ liệu lương thị
          trường IT
        </Typography>
        <Typography sx={{ color: "#333", mb: 1 }}>
          ✔ Xem trước mức lương để có thể lợi thế khi thỏa thuận lương
        </Typography>
        <Typography sx={{ color: "#333", mb: 1 }}>
          ✔ Tìm hiểu về phúc lợi, con người, văn hóa công ty qua các đánh giá
          chân thật
        </Typography>
        <Typography sx={{ color: "#333", mb: 1 }}>
          ✔ Dễ dàng ứng tuyển chỉ với một thao tác
        </Typography>
        <Typography sx={{ color: "#333", mb: 1 }}>
          ✔ Quản lý hồ sơ và quyền riêng tư của bạn
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;