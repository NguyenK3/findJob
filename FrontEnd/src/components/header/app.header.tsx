'use client'

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { styled } from '@mui/system';
import Link from 'next/link';

const Logo = styled('img')({
  width: 40,
  marginRight: 10,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

const CustomAppBar = styled(AppBar)({
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease',
  borderRadius: '8px',
  color: 'black',
});

const WebsiteName = styled(Typography)({
  fontWeight: 'bold',
  fontFamily: 'Comic Sans MS',
  fontSize: '24px',
  letterSpacing: '2px',
  color: '#1976d2',
  textTransform: 'uppercase',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  transition: 'color 0.3s ease, transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    color: '#FF5733',
    transform: 'scale(1.05)',
  },
});

const CustomButton = styled(Button)({
  margin: '0 10px',
  padding: '6px 12px',
  borderRadius: '20px',
  background: '#FFFFC5',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    color: '#B19CD9',
    transform: 'translateY(-2px)',
  },
});

const CTAButton = styled(Button)({
  margin: '0 10px',
  padding: '8px 16px',
  borderRadius: '20px',
  background: '#FF5733',
  color: '#FFFFFF',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    background: '#FF4500',
    transform: 'translateY(-2px)',
  },
});

const Header = () => {
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <CustomAppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingY: 1 }}>
        {/* Logo và tên trang web */}
        <Box display="flex" alignItems="center">
          <Logo
            src="https://cdn.pixabay.com/photo/2024/06/17/16/39/girl-8836068_1280.jpg"
            alt="Logo"
          />
          <WebsiteName variant="h6">KabaNoPro</WebsiteName>
        </Box>

        {/* Tabs ở giữa */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Tabs value={value} onChange={handleChange} textColor="inherit">
            <Tab
              icon={<HomeIcon />}
              label="Home"
              sx={{
                transition: 'color 0.3s ease, transform 0.3s ease',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '10px 15px',
                borderRadius: '20px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                ...(value === 0 && {
                  color: '#e91e63', // Màu cho tab Home khi được chọn
                }),
              }}
            />
            <Tab
              icon={<SearchIcon />}
              label="Search"
              sx={{
                transition: 'color 0.3s ease, transform 0.3s ease',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '10px 15px',
                borderRadius: '20px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                ...(value === 1 && {
                  color: '#3f51b5', // Màu cho tab Search khi được chọn
                }),
              }}
            />
            <Tab
              icon={<BusinessIcon />}
              label="Company"
              sx={{
                transition: 'color 0.3s ease, transform 0.3s ease',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '10px 15px',
                borderRadius: '20px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                ...(value === 2 && {
                  color: '#4caf50', // Màu cho tab Company khi được chọn
                }),
              }}
            />
          </Tabs>
        </Box>

        {/* Biểu tượng mạng xã hội */}
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" href="https://facebook.com">
            <FacebookIcon />
          </IconButton>
          <IconButton color="inherit" href="https://twitter.com">
            <TwitterIcon />
          </IconButton>
          <IconButton color="inherit" href="https://linkedin.com">
            <LinkedInIcon />
          </IconButton>
        </Box>

        {/* Nút CTA */}
        <CTAButton>Sign In Now</CTAButton>
      </Toolbar>
    </CustomAppBar>
  );
};

export default Header;