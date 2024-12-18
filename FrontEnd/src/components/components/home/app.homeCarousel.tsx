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
        {[...Array(3)].map((_, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: "relative",
                backgroundImage: (theme) => `url(${slides[index].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: { xs: "200px", sm: "250px", md: "300px" },
                display: "flex",
                alignItems: "center",
                padding: { xs: 4, sm: 5, md: 6 },
                borderRadius: "8px",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.02)" },
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
                  p: { xs: 3, sm: 4, md: 5 },
                  backgroundColor: "rgba(0, 0, 0, 0.1)", // Increased contrast
                  borderRadius: "8px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
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
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    transition: "color 0.3s ease-in-out",
                    fontSize: { xs: "0.5rem", sm: "0.75rem", md: "1.125rem" },
                    "&:hover": { color: "#FFD700" },
                  }}
                >
                  {slides[index].title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#FFDBBB",
                    mb: 2,
                    lineHeight: 1.5,
                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                    fontSize: { xs: "0.5rem", sm: "0.75rem", md: "1.125rem" },
                  }}
                >
                  {slides[index].description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    px: { xs: 2, sm: 3 }, // Responsive padding
                    py: { xs: 1, sm: 1.25 }, // Responsive padding
                    backgroundColor: "#FF5722",
                    color: "#FFF",
                    borderRadius: "25px",
                    boxShadow: "0px 4px 15px rgba(255, 87, 34, 0.5)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#E64A19",
                      transform: "scale(1.1)",
                      boxShadow: "0px 6px 20px rgba(230, 74, 25, 0.6)",
                    },
                    fontSize: { xs: "0.5rem", sm: "0.75rem", md: "0.875rem" }, // Responsive font size
                  }}
                >
                  Join Now
                </Button>
              </Box>
            </Box>
          </SwiperSlide>
        ))}

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

const arrowButtonStyle = (position: string) => ({
  position: "absolute",
  top: "50%",
  [position]: "10px",
  zIndex: 10,
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  color: "#FFF",
  transform: "translateY(-50%)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  borderRadius: "50%",
});

export default HomeCarousel;

const slides = [
  {
    image: "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/01/hinh-nen-anime-thumb.jpg",
    title: "Discover Your Next Career Move",
    description:
      "Connect with top employers and find job opportunities that match your skills and aspirations. Your dream job is just a click away!",
  },
  {
    image: "https://image.cdn2.seaart.me/2023-09-25/18099464721956869/f24bed890bdab16ce73e907507441825099564ad_high.webp",
    title: "Land Your Dream Job Today",
    description:
      "Browse thousands of job listings from leading companies and take the next big step in your career. Don’t wait—your future starts now.",
  },
  {
    image: "https://png.pngtree.com/background/20211215/original/pngtree-purple-and-white-clouds-beautiful-anime-beautiful-scene-picture-image_1500467.jpg",
    title: "Unlock New Career Opportunities",
    description:
      "Whether you're a fresh graduate or an experienced professional, explore endless job opportunities and elevate your career to the next level.",
  },
];