"use client";

import JobList from "@/components/components/search/app.user.jobList";
import { Box, Container, Typography } from "@mui/material";

const SearchJob = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        mt: 4,
      }}
    >
      <Box
        sx={{
          p: 2,
          mb: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <JobList />
      </Box>
    </Container>
  );
};

export default SearchJob;
