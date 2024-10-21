"use client";
import React, { ReactNode, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import TimerIcon from "@mui/icons-material/Timer";
import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";

const drawerWidthOpen = 240; // Kích thước sidebar khi mở
const drawerWidthClosed = 60; // Kích thước sidebar khi đóng

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen); // Đóng mở sidebar
  };

  const handleAvatarClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box
      sx={{
        width: "auto", // Đổi kích thước sidebar
        overflow: "hidden",
        transition: "width 0.3s ease-in-out", // Hiệu ứng chuyển động khi mở/đóng
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={handleSidebarToggle} // Nhấn vào logo để thu gọn sidebar
      >
        <img
          src="https://cdn.pixabay.com/photo/2024/06/17/16/39/girl-8836068_1280.jpg"
          alt="Logo"
          style={{ height: "40px" }}
        />
      </Toolbar>
      <List>
        {[
          { text: "Dashboard", icon: <DashboardIcon /> },
          { text: "Company", icon: <BusinessIcon /> },
          { text: "User", icon: <PersonIcon /> },
          { text: "Job", icon: <WorkIcon /> },
          { text: "Resume", icon: <TimerIcon /> },
          { text: "Permission", icon: <LockIcon /> },
          { text: "Role", icon: <PeopleIcon /> },
        ].map((item, index) => (
          <ListItem
            component={Link}
            href={`admin/${item.text.toLowerCase()}`}
            key={item.text}
            sx={{
              justifyContent: sidebarOpen ? "initial" : "center", // Canh giữa icon khi sidebar đóng
              padding: sidebarOpen ? "10px 16px" : "10px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f5feff",
                transform: "scale(1.05)",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              },
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sidebarOpen ? 2 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary={item.text} />}{" "}
            {/* Hiển thị text khi sidebar mở */}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: {
            sm: `calc(100% - ${
              sidebarOpen ? drawerWidthOpen : drawerWidthClosed
            }px)`,
          },
          ml: { sm: `${sidebarOpen ? drawerWidthOpen : drawerWidthClosed}px` },
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid #e0e0e0",
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, fontWeight: "700" }}
          >
            Dashboard
          </Typography>

          {/* Notification Bell */}
          <IconButton aria-label="show notifications" color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Avatar */}
          <IconButton
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleAvatarClick}
            sx={{ ml: 2 }}
          >
            <Avatar alt="Admin" src="/static/images/avatar/1.jpg" />
          </IconButton>

          {/* Avatar Menu */}
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "avatar-button",
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? drawerWidthOpen : drawerWidthClosed,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarOpen ? drawerWidthOpen : drawerWidthClosed,
            transition: "width 0.3s ease-in-out",
          },
        }}
        open={sidebarOpen}
      >
        {drawer}
      </Drawer>

      {/* Nội dung chính */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: `calc(100% - ${
              sidebarOpen ? drawerWidthOpen : drawerWidthClosed
            }px)`,
          },
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
