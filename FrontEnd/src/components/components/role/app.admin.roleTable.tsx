import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSession } from "next-auth/react";
import RoleModal from "./app.admin.roleModal";

const RolesTable = () => {
  // State variables
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { data: session } = useSession();
  const access_token = session?.access_token;

  // State for RoleModal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/roles/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await response.json();
      setRoles(data.data.result);
      setTotalCount(data.data.meta.total);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", searchName);
  };

  const handleAddPermission = () => {
    setIsRoleModalOpen(true); // Open RoleModal
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false); // Close RoleModal
  };

  const handleSaveRole = (newRole: IRole) => {
    setRoles((prevRoles) => [...prevRoles, newRole]);
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'Id', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'isActive', headerName: 'Trạng thái', flex: 1 },
    { field: 'createdAt', headerName: 'CreatedAt', flex: 2 },
    { field: 'updatedAt', headerName: 'UpdatedAt', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

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

        {/* DataGrid */}
        <Box style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={roles}
            columns={columns}
            paginationModel={{ page: page - 1, pageSize: rowsPerPage }}
            pagination
            getRowId={(row) => row._id}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1);
              setRowsPerPage(model.pageSize);
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>

        {/* Pagination */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography>
            {`${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, totalCount)} trên ${totalCount} rows`}
          </Typography>
          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
          <Select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value as number)}
            size="small"
          >
            <MenuItem value={10}>10 / trang</MenuItem>
            <MenuItem value={25}>25 / trang</MenuItem>
            <MenuItem value={50}>50 / trang</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* RoleModal */}
      <RoleModal open={isRoleModalOpen} onClose={handleCloseRoleModal} onSave={handleSaveRole} />
    </Box>
  );
}

export default RolesTable;