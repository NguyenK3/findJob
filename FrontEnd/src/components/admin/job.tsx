"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import JobTable from "../components/job/app.admin.jobTable";
import Layout from "./layout";
import { SnackbarProvider } from "notistack";
import CompanyListJob from "../components/job/app.company.companyListJob";

const JobAdminPage = () => {
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
          </Box>
          {/* <JobTable /> */}
          <CompanyListJob />
        </Box>
      </Layout>
    </SnackbarProvider>
  );
};

export default JobAdminPage;