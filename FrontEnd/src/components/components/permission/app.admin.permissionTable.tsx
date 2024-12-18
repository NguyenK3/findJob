import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, Container, Grid, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar, GridPaginationModel } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PermissionModal from "./app.admin.PermissionModal";

const PermissionTable = () => {
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<IPermission[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<IPermission | null>(null);
  const { data: session } = useSession();
  const access_token = session?.access_token;

  const [searchName, setSearchName] = useState("");
  const [searchApi, setSearchApi] = useState("");
  const [searchMethod, setSearchMethod] = useState("");
  const [searchModule, setSearchModule] = useState("");

  const fetchPermissions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/permissions/?current=${currentPage + 1}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Response data:", response);
      setPermissions(data.data.result || []);
      setFilteredPermissions(data.data.result || []); // Cập nhật filteredPermissions
      setTotalRows(data.data.meta.total || 0);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [access_token, currentPage, pageSize]);

  useEffect(() => {
    const filtered = permissions.filter(permission => {
      return (
        (searchName === "" || permission.name.toLowerCase().includes(searchName.toLowerCase())) &&
        (searchApi === "" || (permission.apiPath ?? "").toLowerCase().includes(searchApi.toLowerCase())) &&
        (searchMethod === "" || (permission.method ?? "").toLowerCase().includes(searchMethod.toLowerCase())) &&
        (searchModule === "" || (permission.module ?? "").toLowerCase().includes(searchModule.toLowerCase()))
      );
    });
    setFilteredPermissions(filtered);
  }, [searchName, searchApi, searchMethod, searchModule, permissions]);

  const getColor = (method: IPermission['method']): 'primary' | 'success' | 'warning' | 'error' => {
    switch (method) {
      case 'GET': return 'primary';
      case 'POST': return 'success';
      case 'PATCH': return 'warning';
      case 'DELETE': return 'error';
      default: return 'primary';
    }
  };

  const handleEdit = (permission: IPermission) => {
    setCurrentPermission(permission);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/permissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete permission");
      }

      fetchPermissions();
    } catch (error) {
      console.error("Error deleting permission:", error);
    }
  };

  const columns: GridColDef[] = [
    // { field: '_id', headerName: 'Id', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'apiPath', headerName: 'API', flex: 1 },
    // {
    //   field: 'method',
    //   headerName: 'Method',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Typography color={getColor(params.value)}>{params.value}</Typography>
    //   ),
    // },
    { field: 'module', headerName: 'Module', flex: 1 },
    {
      field: 'createdAt', headerName: 'CreatedAt', flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'updatedAt', headerName: 'UpdatedAt', flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row._id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleOpenModal = () => {
    setCurrentPermission(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setCurrentPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
    fetchPermissions(); // Gọi lại fetchPermissions khi thay đổi trang hoặc kích thước trang
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: 3,
          marginBottom: 3,
          padding: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{
              transition: "all 0.3s ease",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d1d1d1",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="API"
            variant="outlined"
            value={searchApi}
            onChange={(e) => setSearchApi(e.target.value)}
            sx={{
              transition: "all 0.3s ease",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d1d1d1",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Method"
            variant="outlined"
            select
            value={searchMethod}
            onChange={(e) => setSearchMethod(e.target.value)}
            sx={{
              transition: "all 0.3s ease",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d1d1d1",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PATCH">PATCH</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Module"
            variant="outlined"
            value={searchModule}
            onChange={(e) => setSearchModule(e.target.value)}
            sx={{
              transition: "all 0.3s ease",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d1d1d1",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
        </Grid>

        {/* Add Permission Button */}
        <Grid item xs={12} sm={2} display="flex" justifyContent="flex-end" alignItems="center">
          <Button
            variant="outlined"
            color="success"
            onClick={handleOpenModal}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#4caf50",
              },
            }}
          >
            Thêm mới Permission
          </Button>
        </Grid>
      </Grid>

      {/* Permissions Table */}
      <Typography variant="h6" gutterBottom>Danh sách Permissions (Quyền Hạn)</Typography>
      <Box style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredPermissions}
          columns={columns}
          rowCount={totalRows}
          pagination
          paginationMode="server"
          paginationModel={{ page: currentPage, pageSize: pageSize }}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#f9f9f9",
              },
            },
          }}
          getRowId={(row: IPermission) => row._id || ''}
          showCellVerticalBorder
          showColumnVerticalBorder
          autoHeight
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar, // Hiệu ứng Toolbar với filter, export, v.v.
          }}
        />
      </Box>

      {/* Permission Modal */}
      <PermissionModal open={modalOpen} handleClose={handleCloseModal} fetchPermissions={fetchPermissions} currentPermission={currentPermission} />
    </Container>
  );
};

export default PermissionTable;