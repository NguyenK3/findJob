import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSession } from "next-auth/react";
import RoleDialog from "./app.admin.roleModal";

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
  const [currentRole, setCurrentRole] = useState<IRole | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchRoles = async (current: number, pageSize: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/roles/?current=${current}&pageSize=${pageSize}`, {
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
    fetchRoles(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    console.log("Searching for:", searchName);
  };

  const handleAddPermission = () => {
    setIsEditMode(false);
    setCurrentRole(null);
    setIsRoleModalOpen(true); // Open RoleModal
  };

  const handleEditRole = async (role: IRole) => {
    setIsEditMode(true);
    setCurrentRole(role);
    setIsRoleModalOpen(true); // Open RoleModal
  };

  const handleDeleteRole = async (role: IRole) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/roles/${role._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log('response', response);

      if (!response.ok) {
        throw new Error("Failed to delete role");
      }

      fetchRoles(page, rowsPerPage); // Fetch lại data cho roleTable

    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false); // Close RoleModal
  };

  const handleSaveRole = (newRole: IRole) => {
    if (isEditMode) {
      setRoles((prevRoles) =>
        prevRoles.map((role) => (role._id === newRole._id ? newRole : role))
      );
    } else {
      setRoles((prevRoles) => [...prevRoles, newRole]);
    }
  };

  const columns: GridColDef[] = [
    // { field: '_id', headerName: 'Id', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'isActive', headerName: 'Trạng thái', flex: 1 },
    {
      field: 'createdAt', headerName: 'CreatedAt', flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'updatedAt', headerName: 'UpdatedAt', flex: 2,
      renderCell: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEditRole(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteRole(params.row)}>
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
            paginationMode="server"
            rowCount={totalCount}
            getRowId={(row) => row._id}
            onPaginationModelChange={(model: GridPaginationModel) => {
              setPage(model.page + 1);
              setRowsPerPage(model.pageSize);
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      </Box>

      {/* RoleModal */}
      <RoleDialog
        open={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        onSave={handleSaveRole}
        fetchRoles={fetchRoles}
        current={page}
        pageSize={rowsPerPage}
        role={currentRole}
        isEditMode={isEditMode}
      />
    </Box>
  );
}

export default RolesTable;