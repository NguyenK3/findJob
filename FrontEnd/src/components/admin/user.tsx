"use client";

import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import Layout from "./layout";
import UsersTable from "../components/user/app.admin.userTable";

const UserPage = () => {
  return (
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
  );
};

export default UserPage;
