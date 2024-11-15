// pages/roles.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,
  Pagination,
  Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

const RolesTable = () => {
  // State variables
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const roles = [
    {
      id: "671b04159fc04e766bcfa4e6",
      name: "NORMAL_USER",
      status: "ACTIVE",
      createdAt: "25-10-2024 09:36:05",
      updatedAt: "25-10-2024 09:36:05",
    },
    {
      id: "671b04159fc04e766bcfa4e5",
      name: "SUPER_ADMIN",
      status: "ACTIVE",
      createdAt: "25-10-2024 09:36:05",
      updatedAt: "25-10-2024 09:36:05",
    },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchName);
  };

  const handleAddPermission = () => {
    console.log("Opening add permission modal");
  };

  return (
    <Box p={3}>
      {/* Search Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#f9f9f9",
          p: 2,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="body1">Name :</Typography>
        <TextField
          placeholder="nhập dữ liệu"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ height: "fit-content" }}
        >
          Tìm kiếm
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setSearchName("")}
          sx={{ height: "fit-content" }}
        >
          Làm lại
        </Button>
      </Box>

      {/* Roles List Section */}
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          p: 2,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Danh sách Roles (Vai Trò)</Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddPermission}
            >
              Thêm mới
            </Button>
            <IconButton color="default">
              <RefreshIcon />
            </IconButton>
            <IconButton color="default">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>CreatedAt</TableCell>
                <TableCell>UpdatedAt</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        padding: "2px 8px",
                        backgroundColor: "#e0ffd8",
                        borderRadius: "4px",
                        color: "#4caf50",
                        fontWeight: "bold",
                      }}
                    >
                      {role.status}
                    </Box>
                  </TableCell>
                  <TableCell>{role.createdAt}</TableCell>
                  <TableCell>{role.updatedAt}</TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography>
            {`1-2 trên ${roles.length} rows`}
          </Typography>
          <Pagination
            count={Math.ceil(roles.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
          <Select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value)}
            size="small"
          >
            <MenuItem value={10}>10 / trang</MenuItem>
            <MenuItem value={25}>25 / trang</MenuItem>
            <MenuItem value={50}>50 / trang</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}

export default RolesTable;