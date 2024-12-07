"use client";
// components/TopEmployers.js

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import EmployerCard from "./app.employCard";
import TopCompany from "./app.client.companyTop";
import TopCompaniesList from "./app.client.companyTop";

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

      <Grid container spacing={3} justifyContent="center" alignItems="stretch" mt={4}>
        <TopCompaniesList />
      </Grid>
    </Box>
  );
};

export default TopEmployers;