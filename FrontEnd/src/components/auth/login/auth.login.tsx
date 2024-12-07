"use client";

import React, { ComponentType, ReactElement, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Slide,
  SlideProps,
  Fade,
  AlertTitle,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import GoogleIcon from "@mui/icons-material/Google"; // Ensure you have this import
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TransitionProps } from "@mui/material/transitions";

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="left" />;
};

const Login: React.FC = () => {
  const [state, setState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    open: false,
    Transition: Fade,
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const [resMessage, setResMessage] = useState("");

  const handleClick =
    (
      Transition: React.ComponentType<
        TransitionProps & {
          children: React.ReactElement<any, any>;
        }
      >,
    ) =>
      () => {
        setState({
          open: true,
          Transition,
        });
      };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      // Handle login logic here
      // console.log("Email:", email);
      const res = await signIn("credentials", {
        username: email,
        password: password,
        redirect: false,
      });

      if (!res?.error) {
        router.push("/"); // Redirect to home page
      } else {
        handleClick(SlideTransition)();
        setResMessage(res.error);
      }
    } else {
      handleClick(SlideTransition)();
    }
  };

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
        {/* <Button
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
          onClick={() => {
            signIn("google");
          }}
        >
          Đăng nhập bằng Google
        </Button>

        <Typography sx={{ mb: 2, textAlign: "center", fontSize: "0.9rem" }}>
          hoặc
        </Typography> */}

        {/* Email and Password Fields */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          sx={{ mb: 2 }}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <Typography color="error" sx={{ mt: 0 }}>
            {errors.email}
          </Typography>
        )}
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
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        {errors.password && (
          <Typography color="error" sx={{ mt: 1 }}>
            {errors.password}
          </Typography>
        )}

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
          onClick={handleLogin}
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
            href="/auth/signup"
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
      <Snackbar
        open={state.open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {resMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
