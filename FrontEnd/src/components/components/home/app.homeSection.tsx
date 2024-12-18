"use client";

import styled from "@emotion/styled";
import { AccountCircle, Computer, Description } from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Icon,
  Grid
} from "@mui/material";
import { useRouter } from "next/navigation";

// Styled Card with box-shadow and transition effects
const StyledCard = styled(Card)({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Box shadow for normal state
  "&:hover": {
    transform: "translateY(-10px)", // Hover effect for card lift
    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)", // Increased shadow on hover
  },
  minWidth: "300px", // Consistent width for all cards
  margin: "20px", // Margin for spacing between cards
});


// Styled Icon with transition and hover effects
const StyledIcon = styled(Icon)({
  fontSize: "48px",
  transition: "transform 0.3s ease, color 0.3s ease",
  "&:hover": {
    transform: "scale(1.2)", // Scale icon on hover
    color: "#f50057", // Change icon color on hover
  },
});

// Example for one card
interface ToolCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  buttonColor?: string;
  onClick?: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  onClick,
}) => {
  return (
    <StyledCard>
      <CardContent sx={{ textAlign: "center", height: "100%" }}>
        {/* Icon with effects */}
        <Icon component={icon} sx={{ mb: 2 }} />

        {/* Title with hover effect */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#3f51b5", // Change title color on hover
            },
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mb: 2,
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#757575", // Slight change on hover
            },
          }}
        >
          {description}
        </Typography>

        {/* Button with hover and shadow effects */}
        <Button
          variant="outlined"
          sx={{
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)", // Slight lift on hover
              boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)", // Shadow on hover
              backgroundColor: "#f50057",
              color: "#fff",
            },
          }}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </StyledCard>
  );
};

// Section Component for The Best Tools for Finding Your Next Job
const HomeSection = () => {
  const router = useRouter();

  const handleViewTemplates = () => {
    router.push('/cv');
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
        mt: 4,
        mx: "auto",
        maxWidth: "1200px",
        padding: "20px" // Padding around the section
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            left: "50%",
            bottom: "-10px",
            width: "60px",
            height: "4px",
            backgroundColor: "#f50057",
            transform: "translateX(-50%)",
          },
        }}
      >
        The Best Tools for Finding Your Next Job
      </Typography>
      <Typography
        variant="body1"
        align="center"
        sx={{
          mb: 5,
          color: "#666",
          maxWidth: "600px",
          mx: "auto",
        }}
      >
        Discover professional tools that help you craft your resume, upgrade
        your CV, and stay updated with the latest industry knowledge.
      </Typography>

      <Grid container spacing={3}>
        {/* Personal Profile Card */}
        <Grid item xs={12} md={4}>
          <ToolCard
            icon={AccountCircle}
            title="Create a Personal Profile"
            description="Build a comprehensive IT profile with structured sections and detailed suggestions."
            buttonText="Update Profile"
            buttonColor="error"
            onClick={() => router.push('/manage-user')}
          />
        </Grid>

        {/* CV Template Card */}
        <Grid item xs={12} md={4}>
          <ToolCard
            icon={Description}
            title="CV Templates"
            description="Upgrade your CV with industry-recommended templates."
            buttonText="View CV Templates"
            onClick={handleViewTemplates}
          />
        </Grid>

        {/* IT Blog Card */}
        <Grid item xs={12} md={4}>
          <ToolCard
            icon={Computer}
            title="IT Blog"
            description="Stay updated with the latest industry trends and knowledge."
            buttonText="Explore Blog"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeSection;
