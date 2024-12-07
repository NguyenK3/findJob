"use client"

import React, { useEffect, useState } from "react";
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
  Avatar,
  MenuItem,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import TimerIcon from "@mui/icons-material/Timer";
import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;

interface IPermission {
  [key: string]: boolean;
}

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [permissions, setPermissions] = useState<IPermission>({});
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const router = useRouter();
  const access_token = session?.access_token;

  useEffect(() => {
    if (session) {
      // console.log("Session:", session.user.permissions)
      const newPermissions: IPermission = {};
      session.user.permissions.forEach(item => {
        if (item.module) {
          newPermissions[item.module] = true;
        }
      });
      setPermissions(newPermissions);
      console.log("Permissions:", newPermissions);
    }
  }, [session]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  }

  const handleCallHome = () => {
    router.push("/");
  }


  const sidebarItems = [
    { text: "Dashboard", icon: <DashboardIcon />, Module: "DASHBOARD", href: "/admin" },
    { text: "Company", icon: <BusinessIcon />, Module: "COMPANIES", href: "/admin/company" },
    { text: "User", icon: <PersonIcon />, Module: "USERS", href: "/admin/user" },
    { text: "Job", icon: <WorkIcon />, Module: "JOBS", href: "/admin/job" },
    { text: "Resume", icon: <TimerIcon />, Module: "RESUMES", href: "/admin/resume" },
    { text: "Permission", icon: <LockIcon />, Module: "PERMISSIONS", href: "/admin/permission" },
    { text: "Role", icon: <PeopleIcon />, Module: "ROLES", href: "/admin/role" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: {
            sm: `calc(100% - ${sidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
          },
          ml: { sm: `${sidebarOpen ? drawerWidthOpen : drawerWidthClosed}px` },
          transition: "box-shadow 0.5s ease-in-out, margin-left 0.5s",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%", // Đảm bảo bao phủ toàn bộ chiều rộng
            padding: "0 16px", // Căn lề ngang
            backgroundColor: "white",
          }}
        >
          {/* Nút mở Sidebar */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{
              mr: 2,
              display: { sm: "none" }, // Chỉ hiển thị trên màn hình nhỏ
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Tiêu đề */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1, // Chiếm không gian còn lại
              // textAlign: "center", // Căn giữa tiêu đề
              color: "black",
            }}
          >
            Dashboard
          </Typography>

          {/* Khu vực Avatar và Menu */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Avatar */}
            <IconButton
              aria-controls={anchorEl ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
              onClick={handleAvatarClick}
              sx={{
                ml: 2,
              }}
            >
              <Avatar alt="Admin" src="/static/images/avatar/1.jpg" />
            </IconButton>

            {/* Avatar Menu */}
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "avatar-button",
                sx: {
                  transform: "scale(0.9)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
              sx={{
                "& .MuiMenu-paper": {
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>Manage Users</MenuItem>
              <MenuItem onClick={handleCallHome}>Home</MenuItem>
              <MenuItem onClick={() => {
                handleLogout()
              }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>

      </AppBar >
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? drawerWidthOpen : drawerWidthClosed,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? drawerWidthOpen : drawerWidthClosed,
            transition: "width 0.5s ease-in-out",
          },
        }}
        open={sidebarOpen}
      >
        {/* Thanh công cụ chứa logo */}
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "10px 0",
              cursor: "pointer",
              "&:hover img": {
                transform: "scale(1.1)",
                transition: "transform 0.3s ease",
              },
            }}
            onClick={handleSidebarToggle}
          >
            <Avatar
              alt="Logo"
              src="https://cdn.pixabay.com/photo/2024/06/17/16/39/girl-8836068_1280.jpg"
              sx={{
                width: sidebarOpen ? 80 : 40,
                height: sidebarOpen ? 80 : 40,
                transition: "all 0.3s ease-in-out",
              }}
            />
          </Box>
        </Toolbar>

        {/* Danh sách sidebar */}
        <Box sx={{ overflow: "auto" }}>
          <List>
            {sidebarItems
              .filter((item) => permissions?.[item.Module])
              .map((item) => (
                <ListItem
                  component={Link}
                  href={item.href}
                  key={item.text}
                  sx={{
                    justifyContent: "center", // Căn giữa ListItem khi sidebar đóng
                    padding: "10px 16px",
                    textAlign: sidebarOpen ? "left" : "center",
                  }}
                  onClick={(e) => {
                    // Ngăn chặn việc mở/đóng sidebar khi nhấp vào ListItem
                    e.stopPropagation();
                  }}
                >
                  {/* Biểu tượng */}
                  <ListItemIcon
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minWidth: sidebarOpen ? "auto" : "unset",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {/* Văn bản */}
                  <ListItemText
                    primary={item.text}
                    sx={{
                      display: sidebarOpen ? "block" : "none", // Ẩn text khi đóng sidebar
                      // textAlign: "center", // Căn giữa text khi mở
                      paddingLeft: sidebarOpen ? "10px" : "0", // Thêm padding cho text
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: `calc(100% - ${sidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
          },
          opacity: 0,
          animation: "fadeIn 0.5s ease forwards",
          "@keyframes fadeIn": {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
        }}
        onClick={(e) => {
          // Ngăn chặn việc mở/đóng sidebar khi nhấp vào ListItem
          e.stopPropagation();
        }}
      >

        <Toolbar />
        {children}
      </Box>
    </Box >
  );
};

export default Layout;