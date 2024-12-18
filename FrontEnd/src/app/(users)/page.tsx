// pages/index.js
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import HomeCarousel from "@/components/components/home/app.homeCarousel";
import Header from "@/components/header/app.header";
import HomeSection from "@/components/components/home/app.homeSection";
import TopEmployers from "@/components/components/company/app.topEmployee";
import Footer from "@/components/footer/app.footer";
import { getServerSession } from "next-auth/next";
import authOptions from "../api/auth/[...nextauth]/options";

const Home = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="p-0"
        ></Typography>
        <HomeCarousel />
        <HomeSection />
        <TopEmployers />
      </Container>
    </div>
  );
};

export default Home;
