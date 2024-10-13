"use client";
// components/TopEmployers.js

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import EmployerCard from "./app.employCard";

const employers = [
  {
    logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVVIRFE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1ae7acc317bfb2f261c8b580725af2d56ae34b7e/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtCcWpBPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--79eee5883893a012786006950460867831e6f661/money-forward-vi-t-nam-logo.png",
    company: "MONEY FORWARD VIETNAM CO.,LTD",
    skills: ["PHP", "Golang", "Ruby on Rails", "Database", "SQL", "English"],
    locations: ["Ho Chi Minh", "Ha Noi"],
    jobCount: 10,
  },
  {
    logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeFQvU3c9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--59b72c9b8c38d3b3cd69edd784051a8691672f00/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtCcWpBPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--79eee5883893a012786006950460867831e6f661/NAB_Logo_RGB_1x1.png",
    company: "NAB Innovation Centre Vietnam",
    skills: ["Java", "NodeJS", "ReactJS", "Agile", "DevOps", "Cloud"],
    locations: ["Ha Noi", "Ho Chi Minh"],
    jobCount: 15,
  },
  {
    logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOExhSWc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--d257e70c6585afdab6d5516fdec5419a75319c18/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtCcWpBPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--79eee5883893a012786006950460867831e6f661/logo.png",
    company: "ABBANK",
    skills: [
      "Java",
      "Solution Architect",
      "Security",
      "Python",
      "DevOps",
      "Cloud",
    ],
    locations: ["Ho Chi Minh", "Ha Noi"],
    jobCount: 22,
  },
  // Add more companies as needed
];

// Limiting to 6 employers
const limitedEmployers = employers.slice(0, 6);

const TopEmployers = () => {
  return (
    <Box sx={{ py: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 3,
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
        Nhà tuyển dụng hàng đầu
      </Typography>

      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {limitedEmployers.map((employer) => (
          <Grid xs={12} sm={6} md={4} key={employer.company}>
            <Box sx={{ height: "100%" }}>
              <EmployerCard {...employer} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TopEmployers;