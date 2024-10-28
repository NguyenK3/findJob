"use client";

import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  IconButton,
  Paper,
  Box,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import UserDialog from "./app.admin.userModal";

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmcm9tIHNlcnZlciIsInN1YiI6IlRva2VuIGxvZ2luIiwiX2lkIjoiNjcxYjA0MTU5ZmMwNGU3NjZiY2ZhNGVhIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJuYW1lIjoiSSdtIGFkbWluIiwicm9sZSI6eyJfaWQiOiI2NzFiMDQxNTlmYzA0ZTc2NmJjZmE0ZTUiLCJuYW1lIjoiU1VQRVJfQURNSU4ifSwiaWF0IjoxNzI5ODU0MTkwLCJleHAiOjE3Mjk5NDA1OTB9.ERqyk_Fc910o493t3jEJc4WwtKOScRCiNhrVrUTpqRo";

const fetchUsers = async (
  page: number,
  pageSize: number,
  searchName: string
) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/?current=${
        page + 1
      }&pageSize=${pageSize}&name=/${searchName}/i`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const d = await response.json();
    return { users: d.data.result, totalCount: d.data.meta.total };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], totalCount: 0 };
  }
};

const fetchCompanies = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/companies", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch companies");
    }
    const data = await response.json();
    return data.data.result;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

const fetchRoles = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/roles", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch roles");
    }
    const data = await response.json();
    return data.data.result;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

interface UsersTableProps {
  orderBy: string;
  order: "asc" | "desc";
  handleRequestSort: (property: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  orderBy,
  order,
  handleRequestSort,
}) => {
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [companies, setCompanies] = React.useState<ICompany[]>([]);
  const [roles, setRoles] = React.useState<IRole[]>([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [searchName, setSearchName] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [userModalOpen, setUserModalOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    const loadUsers = async () => {
      const { users, totalCount } = await fetchUsers(
        page,
        pageSize,
        searchName
      );
      setUsers(users);
      setTotalCount(totalCount);
    };
    loadUsers();
  }, [page, pageSize, searchName]);

  React.useEffect(() => {
    const loadCompanies = async () => {
      const companies = await fetchCompanies();
      setCompanies(companies);
    };
    loadCompanies();
  }, []);

  React.useEffect(() => {
    const loadRoles = async () => {
      const roles = await fetchRoles();
      setRoles(roles);
    };
    loadRoles();
  }, []);

  const handleSearchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchName(event.target.value);
  };

  const handleReset = () => {
    setSearchName("");
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedUsers.map((id) =>
        fetch(`http://localhost:8000/api/v1/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        })
      );
      await Promise.all(deletePromises);
      setUsers(
        users.filter((user) => user._id && !selectedUsers.includes(user._id))
      );
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const handleCreateOpen = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    setUserModalOpen(true);
  };

  const handleUpdateOpen = (user: IUser) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setUserModalOpen(true);
  };

  const handleUserModalClose = () => {
    setUserModalOpen(false);
    setCurrentUser(null);
  };

  const handleUserCreate = async (formData: IUser) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // const responseBody = await response.json();
      // console.log("Response Body: ", responseBody);
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      await fetchUsers(page, pageSize, searchName);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUserUpdate = async (formData: IUser) => {
    try {
      // Loại bỏ trường mật khẩu khỏi formData
      const { password, ...updatedFormData } = formData;

      const response = await fetch(
        `http://localhost:8000/api/v1/users/${currentUser?._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      const responseBody = await response.json();
      console.log("Response Body: ", responseBody);

      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
      await fetchUsers(page, pageSize, searchName); // Tải lại dữ liệu người dùng sau khi cập nhật
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "",
      flex: 0.1,
      renderCell: (params) => (
        <Checkbox
          checked={selectedUsers.includes(params.row._id)}
          onChange={() => {
            setSelectedUsers((prevSelected) =>
              prevSelected.includes(params.row._id)
                ? prevSelected.filter((userId) => userId !== params.row._id)
                : [...prevSelected, params.row._id]
            );
          }}
        />
      ),
    },
    { field: "_id", headerName: "Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 2 },
    { field: "email", headerName: "Email", flex: 2 },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 2,
      sortable: true,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
    },
    {
      field: "updatedAt",
      headerName: "UpdatedAt",
      flex: 2,
      sortable: true,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            aria-label="edit"
            onClick={() => handleUpdateOpen(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Name"
          variant="outlined"
          size="small"
          value={searchName}
          onChange={handleSearchNameChange}
        />
        <Button variant="outlined" color="warning" onClick={() => setPage(0)}>
          Tìm kiếm
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Làm lại
        </Button>
        <Button variant="outlined" color="success" onClick={handleCreateOpen}>
          Thêm mới
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSelected}
          disabled={selectedUsers.length === 0}
        >
          Xóa các người dùng đã chọn
        </Button>
      </Box>

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          paginationModel={{ page, pageSize }}
          pageSizeOptions={[5, 10, 25]}
          rowCount={totalCount}
          paginationMode="server"
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          sortingMode="client"
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
          getRowId={(row) => row._id}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            boxShadow: 3,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
        />
      </Box>

      <UserDialog
        open={userModalOpen}
        handleClose={handleUserModalClose}
        handleCreate={handleUserCreate}
        handleUpdate={handleUserUpdate}
        user={currentUser}
        isEditMode={isEditMode}
        companies={companies}
        roles={roles}
      />
    </Box>
  );
};

export default UsersTable;
