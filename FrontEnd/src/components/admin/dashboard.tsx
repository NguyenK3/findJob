// pages/index.js
"use client"
import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Layout from "./layout";

const Home = () => {
  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {[1, 2, 3].map((card, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    Card title
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Active Users
                  </Typography>
                  <Typography variant="h4">112,893</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Home;