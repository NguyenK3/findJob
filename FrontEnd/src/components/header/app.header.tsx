"use client";

import React, { SyntheticEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { color, styled } from "@mui/system";
import Link from "next/link";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Logo = styled("img")({
  width: 40,
  marginRight: 10,
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const CustomAppBar = styled(AppBar)({
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease",
  borderRadius: "8px",
  color: "black",
});

const WebsiteName = styled(Typography)({
  fontWeight: "bold",
  fontFamily: "serif",
  fontSize: "24px",
  letterSpacing: "2px",
  color: "#1976d2",
  textTransform: "uppercase",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  transition: "color 0.3s ease, transform 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    color: "#FF5733",
    transform: "scale(1.05)",
  },
});

const CustomButton = styled(Button)({
  margin: "0 10px",
  padding: "6px 12px",
  borderRadius: "20px",
  background: "#FFFFC5",
  fontWeight: "bold",
  transition: "background-color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    color: "#B19CD9",
    transform: "translateY(-2px)",
  },
});

const CTAButton = styled(Button)({
  margin: "0 10px",
  padding: "8px 16px",
  borderRadius: "20px",
  background: "#FF5733",
  color: "#FFFFFF",
  fontWeight: "bold",
  transition: "background-color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    background: "#FF4500",
    transform: "translateY(-2px)",
  },
});

const Header = () => {
  const { data: session } = useSession();
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      router.push("/");
    } else if (newValue === 1) {
      router.push("/searchJob");
    }
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Tab"
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <IconButton onClick={toggleDrawer(false)} sx={{ float: "right" }}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" sx={{ padding: 2 }}>
        Menu
      </Typography>
      <Tabs
        value={value}
        onChange={handleChange}
        orientation="vertical"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Tab icon={<HomeIcon />} label="Home" />
        <Tab icon={<SearchIcon />} label="Search" />
        <Tab icon={<BusinessIcon />} label="Company" />
      </Tabs>
      <Box sx={{ padding: 2 }}>
        <CTAButton>Sign In Now</CTAButton>
        <Box display="flex" justifyContent="space-around">
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
      </Box>
    </Box>
  );

  return (
    <CustomAppBar position="static">
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", paddingY: 1 }}
      >
        {/* Logo và tên trang web */}
        <Box display="flex" alignItems="center">
          <Logo
            src="https://cdn.pixabay.com/photo/2024/06/17/16/39/girl-8836068_1280.jpg"
            alt="Logo"
          />
          <WebsiteName variant="h6">KabaNoPro</WebsiteName>
        </Box>

        {/* Tabs ở giữa cho máy tính */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
          }}
        >
          <Tabs value={value} onChange={handleChange} textColor="inherit">
            <Tab icon={<HomeIcon />} label="Home" />
            <Tab icon={<SearchIcon />} label="Search" />
            <Tab icon={<BusinessIcon />} label="Company" />
          </Tabs>
        </Box>

        {/* Biểu tượng menu cho di động */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
          <IconButton onClick={toggleDrawer(true)} color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Nút CTA cho máy tính */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            "> button > a": {
              color: "unset",
              textDecoration: "unset",
            },
          }}
        >
          {session ? (
            <>
              {/* Menu thả xuống người dùng */}
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar alt="User Avatar" src="/user-avatar.png" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                keepMounted
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
                {session.user &&
                  session.user.role &&
                  session.user.role.name !== "user" && (
                    <MenuItem onClick={handleMenuClose}>
                      <Link href="/admin">Admin DashBoard</Link>
                    </MenuItem>
                  )}
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    signOut();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <CTAButton>
                <Link href="/auth/signin">Sign In Now</Link>
              </CTAButton>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Swipeable Drawer for mobile menu */}
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {drawerContent}
      </SwipeableDrawer>
    </CustomAppBar>
  );
};

export default Header;
