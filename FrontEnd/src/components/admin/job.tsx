"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import JobTable from "../components/job/app.admin.jobTable";
import Layout from "./layout";

const JobAdminPage = () => {
  return (
    <Layout>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
        </Box>
        <JobTable />
      </Box>
    </Layout>
  );
};

export default JobAdminPage;