"use client";

import JobList from "@/components/components/search/app.user.jobList";
import SearchBar from "@/components/components/search/app.user.searchBar";
import { Box, Container, Typography } from "@mui/material";

const SearchJob = () => {
  return (
    <Container
      maxWidth="fluid"
      sx={{
        mt: 4,
      }}
    >
      {/* Search Bar Section */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: 2,
        }}
      >
        <SearchBar />
      </Box>

      {/* Job List Section */}
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
