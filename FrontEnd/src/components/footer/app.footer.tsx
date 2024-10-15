"use client";
import { Box, Typography, Link, IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundImage:
          'url("https://static.vecteezy.com/system/resources/previews/015/840/127/large_2x/luxurious-colorful-liquid-marble-surface-background-dark-red-color-beautiful-fluid-abstract-marble-oil-paint-background-illustration-free-vector.jpg")', // Đổi màu nền cho footer
        backgroundSize: "cover", // Ensure the background image covers the entire footer
        color: "white",
        p: 4,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        fontFamily: "serif", // Đổi phông chữ
      }}
    >
      {/* Các cột điều hướng */}
      <Box
        sx={{
          flexBasis: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          mt: 4,
          flexDirection: { xs: "column", md: "row" }, // Responsive cho mobile
        }}
      >
        {/* Logo và slogan */}
        <Box sx={{ textAlign: "center", mb: 4, flexBasis: "30%" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              fontFamily: "serif",
              mb: 1,
              "&:hover": {
                color: "#F6CEFC",
                transition: "color 0.3s ease",
              },
            }}
          >
            <Box component="span" sx={{ color: "#F6CEFC" }}>
              Kaba
            </Box>
            NoPro
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"Comic Sans MS", sans-serif',
              "&:hover": {
                color: "#F6CEFC",
                transition: "color 0.3s ease",
              },
            }}
          >
            Ít nhưng mà chất
          </Typography>

          {/* Social Media Icons */}
          <Box sx={{ mt: 2 }}>
            <IconButton
              sx={{
                color: "#fff",
                mx: 1,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)", // Thêm box shadow
                transition: "transform 0.3s ease, box-shadow 0.3s ease", // Thêm transition
                "&:hover": {
                  color: "#F6CEFC", // Thay đổi màu khi hover
                  transform: "scale(1.2)", // Hiệu ứng scale khi hover
                  boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.5)", // Thay đổi shadow khi hover
                },
              }}
              aria-label="LinkedIn"
            >
              <LinkedInIcon fontSize="large" />
            </IconButton>
            <IconButton
              sx={{
                color: "#fff",
                mx: 1,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  color: "#F6CEFC",
                  transform: "scale(1.2)",
                  boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.5)",
                },
              }}
              aria-label="Facebook"
            >
              <FacebookIcon fontSize="large" />
            </IconButton>
            <IconButton
              sx={{
                color: "#fff",
                mx: 1,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  color: "#F6CEFC",
                  transform: "scale(1.2)",
                  boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.5)",
                },
              }}
              aria-label="YouTube"
            >
              <YouTubeIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        {/* Về KabaNoPro */}
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              "&:hover": {
                color: "#F6CEFC",
                transition: "color 0.3s ease",
              },
            }}
          >
            Về KabaNoPro
          </Typography>
          <Link href="/" color="inherit" sx={linkStyle}>
            Trang Chủ
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Về ITviec.com
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Dịch vụ gọi ý ứng viên
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Liên Hệ
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Việc Làm IT
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Câu hỏi thường gặp
          </Link>
        </Box>

        {/* Chương trình */}
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              "&:hover": {
                color: "#F6CEFC",
                transition: "color 0.3s ease",
              },
            }}
          >
            Chương trình
          </Typography>
          <Link href="/" color="inherit" sx={linkStyle}>
            Chuyện IT
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Cuộc thi viết
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Việc làm IT nổi bật
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Khảo sát thường niên
          </Link>
        </Box>

        {/* Điều khoản chung */}
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              "&:hover": {
                color: "#F6CEFC",
                transition: "color 0.3s ease",
              },
            }}
          >
            Điều khoản chung
          </Typography>
          <Link href="/" color="inherit" sx={linkStyle}>
            Quy định bảo mật
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Quy chế hoạt động
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Giải quyết khiếu nại
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Thỏa thuận sử dụng
          </Link>
          <Link href="/" color="inherit" sx={linkStyle}>
            Thông cáo báo chí
          </Link>
        </Box>

        {/* Liên hệ */}
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              "&:hover": {
                color: "#F6CEFC",
                transition: "color 0.3s ease",
              },
            }}
          >
            Liên hệ để đăng tin tuyển dụng tại:
          </Typography>
          <Typography variant="body2" sx={contactStyle}>
            Hồ Chí Minh: (+84) 333 567 890
          </Typography>
          <Typography variant="body2" sx={contactStyle}>
            Hà Nội: (+84) 333 567 890
          </Typography>
          <Typography variant="body2" sx={contactStyle}>
            Email: love@itviec.com
          </Typography>
          <Link href="/" color="inherit" sx={linkStyle}>
            Gửi thông tin liên hệ
          </Link>
        </Box>
      </Box>

      {/* Copyright */}
      <Box sx={{ textAlign: "center", mt: 4, flexBasis: "100%" }}>
        <Typography variant="body2">
          Copyright © KabaNoPro JSC | MST: 0123456789
        </Typography>
      </Box>
    </Box>
  );
};

// Custom style cho Link
const linkStyle = {
  display: "block",
  mb: 1,
  textDecoration: "none", // Bỏ hiệu ứng underline
  "&:hover": {
    color: "#F6CEFC",
    transition: "color 0.3s ease",
  },
};

// Custom style cho contact text
const contactStyle = {
  display: "block",
  mb: 1,
  "&:hover": {
    color: "#F6CEFC",
    transition: "color 0.3s ease",
  },
};

export default Footer;
import { transform } from "next/dist/build/swc";
