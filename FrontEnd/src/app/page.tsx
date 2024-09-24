// pages/index.js
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import HomeCarousel from '@/components/components/home/app.homeCarousel';
import Header from '@/components/header/app.header';

const Home = () => {
  return (
    <>
      <Header />
      <Container maxWidth='xl'
      >
        <Typography variant="h4" component="h1" gutterBottom className='p-0'>
        </Typography>
        <HomeCarousel />
      </Container>
    </>
  );
};

export default Home;