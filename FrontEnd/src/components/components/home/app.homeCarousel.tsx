"use client";

import { Box, Typography, Button, Container, IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const HomeCarousel = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{ position: "relative", overflow: "hidden", mt: 5 }}
    >
      <Swiper
        spaceBetween={30}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{ delay: 3000 }}
        loop={true}
        modules={[Navigation, Autoplay]}
        style={{ borderRadius: "8px", overflow: "hidden" }}
      >
        {/* Example of multiple slides */}
        {[
          {
            image:
              "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/01/hinh-nen-anime-thumb.jpg",
            title: "Discover Your Next Career Move",
            description:
              "Connect with top employers and find job opportunities that match your skills and aspirations. Your dream job is just a click away!",
          },
          {
            image:
              "https://cdn.popsww.com/blog/sites/2/2022/10/nhan-vat-nu-anime-cute-1920x1080.jpg",
            title: "Land Your Dream Job Today",
            description:
              "Browse thousands of job listings from leading companies and take the next big step in your career. Don’t wait—your future starts now.",
          },
          {
            image:
              "https://simg.zalopay.com.vn/zlp-website/assets/phim_anime_hay_24_590c912b02.jpg",
            title: "Unlock New Career Opportunities",
            description:
              "Whether you're a fresh graduate or an experienced professional, explore endless job opportunities and elevate your career to the next level.",
          },
        ].map((slide, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: "relative",
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "300px",
                display: "flex",
                alignItems: "center",
                padding: 3,
                borderRadius: "8px",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.02)" }, // subtle zoom effect on hover
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.1)", // Adds a subtle background behind text
                  borderRadius: "8px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", // Box shadow for depth
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out", // Smooth transitions
                  "&:hover": {
                    transform: "scale(1.02)", // Subtle scaling effect on hover
                    boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: "#FFF",
                    fontWeight: "bold",
                    mb: 1,
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Enhanced text shadow for a 3D look
                    transition: "color 0.3s ease-in-out", // Smooth color transition on hover
                    "&:hover": {
                      color: "#FFD700", // Change color on hover
                    },
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#FFDBBB",
                    mb: 2, // Margin bottom before the button
                    lineHeight: 1.5, // Better line height for readability
                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {slide.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    px: 3,
                    py: 1.25,
                    backgroundColor: "#FF5722",
                    color: "#FFF",
                    borderRadius: "25px",
                    boxShadow: "0px 4px 15px rgba(255, 87, 34, 0.5)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#E64A19",
                      transform: "scale(1.1)", // Enhance scaling on hover for emphasis
                      boxShadow: "0px 6px 20px rgba(230, 74, 25, 0.6)", // Increase shadow on hover
                    },
                  }}
                >
                  Join Now
                </Button>
              </Box>
            </Box>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <IconButton className="custom-prev" sx={arrowButtonStyle("left")}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton className="custom-next" sx={arrowButtonStyle("right")}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Swiper>
    </Container>
  );
};

// Arrow button styling
const arrowButtonStyle = (position: any) => ({
  position: "absolute",
  top: "50%",
  [position]: "10px",
  zIndex: 10,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "#FFF",
  transform: "translateY(-50%)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  borderRadius: "50%",
});

export default HomeCarousel;