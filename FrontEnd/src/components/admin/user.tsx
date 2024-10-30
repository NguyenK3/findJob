"use client"

import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import Layout from "./layout";
import UsersTable from "../components/user/app.admin.userTable";
import { SnackbarProvider } from "notistack";

const UserPage = () => {
  return (
    <SnackbarProvider
      maxSnack={3} // Số lượng snackbar tối đa có thể hiển thị cùng lúc
      anchorOrigin={{
        vertical: "bottom", // Vị trí hiển thị ở dưới cùng
        horizontal: "right", // Hiển thị ở góc phải
      }}
      autoHideDuration={3000} // Thời gian hiển thị snackbar (3 giây)
      preventDuplicate // Ngăn chặn việc hiển thị cùng một thông báo nhiều lần
    >
      <Layout>
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Danh sách Users</Typography>
          </Box>

          <UsersTable orderBy="name" order="asc" handleRequestSort={() => {}} />
        </Box>
      </Layout>
    </SnackbarProvider>
  );
};

export default UserPage;