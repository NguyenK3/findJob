// pages/index.js
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import HomeCarousel from '@/components/components/home/app.homeCarousel';
import Header from '@/components/header/app.header';
import HomeSection from '@/components/components/home/app.homeSection';
import TopEmployers from '@/components/components/company/app.topEmployee';
import Footer from '@/components/footer/app.footer';

const Home = () => {
  return (
    <>
      <Header />
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
      <Footer />
      {console.log("Check", process.env.NEXT_PUBLIC_BACKEND_URL)}
    </>
  );
};

export default Home;