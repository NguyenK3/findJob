"use client";
import React, {
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  TextField,
  Modal,
  IconButton,
  Toolbar,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import CompanyModal from "./app.admin.companyModal";
import { format } from "date-fns";
import { TransitionProps, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";

// Define the TransitionComponent
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CompanyList = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<ICompany | null>(null);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "name", sort: "asc" },
  ]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const [confirmAddOpen, setConfirmAddOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  const handleCreateOpen = () => {
    setIsEditMode(false);
    setCurrentCompany(null);
    setConfirmAddOpen(true);
  };

  const handleUpdateOpen = (company: ICompany) => {
    setIsEditMode(true);
    setCurrentCompany(company);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const { data: session } = useSession();
  const access_token = session?.access_token;

  useEffect(() => {
    getData();
  }, [page, pageSize, searchName, searchAddress]);

  const getData = async () => {
    console.log("user_id", session?.user.company?._id)
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/companies/?current=${page + 1
        }&pageSize=${pageSize}&name=/${searchName}/i&address=/${searchAddress}/i`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const d = await res.json();

      if (d.data && d.data.result) {
        let sortedData = d.data.result;
        sortedData = sortData(sortedData, sortModel);
        setCompanies(sortedData);
        setTotalCount(d.data.meta.total);
      } else {
        console.error("Invalid API response structure", d);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const sortData = (data: ICompany[], sortModel: GridSortModel) => {
    if (sortModel.length === 0) return data;

    const { field, sort } = sortModel[0];
    return data.slice().sort((a, b) => {
      const fieldTyped = field as keyof ICompany;
      if (a[fieldTyped] == null || b[fieldTyped] == null) return 0;
      if (a[fieldTyped] < b[fieldTyped]) return sort === "asc" ? -1 : 1;
      if (a[fieldTyped] > b[fieldTyped]) return sort === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSearchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchName(event.target.value);
  };

  const handleSearchAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchAddress(event.target.value);
  };

  const handleReset = () => {
    setSearchName("");
    setSearchAddress("");
  };

  const handleSubmit = async (companyData: ICompany) => {
    const url = isEditMode
      ? `http://localhost:8000/api/v1/companies/${currentCompany?._id}`
      : "http://localhost:8000/api/v1/companies/";
    const method = isEditMode ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (res.ok) {
      getData();
      handleClose();
      enqueueSnackbar(
        isEditMode ? "Cập nhật công ty thành công" : "Thêm công ty thành công",
        { variant: "success" },
      );
    } else {
      console.error("Failed to submit company data");
      enqueueSnackbar(
        isEditMode ? "Cập nhật công ty thất bại" : "Thêm công ty thất bại",
        { variant: "error" },
      );
    }
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortModel([...newSortModel]);
    setCompanies(sortData(companies, newSortModel));
  };

  const handleSelectCompany = (id: string) => {
    setSelectedCompanies((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((companyId) => companyId !== id)
        : [...prevSelected, id],
    );
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/companies/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        setCompanies(companies.filter((company) => company._id !== id));
        enqueueSnackbar("Xóa công ty thành công", { variant: "success" });
      } else {
        enqueueSnackbar("Xóa công ty thất bại", { variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      enqueueSnackbar("Xóa công ty thất bại", { variant: "error" });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedCompanies.map((id) =>
        fetch(`http://localhost:8000/api/v1/companies/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }),
      );
      await Promise.all(deletePromises);
      setCompanies(
        companies.filter(
          (company) => company._id && !selectedCompanies.includes(company._id),
        ),
      );
      setSelectedCompanies([]);
      enqueueSnackbar("Xóa các công ty đã chọn thành công", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting companies:", error);
      enqueueSnackbar("Xóa các công ty đã chọn thất bại", { variant: "error" });
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

  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "",
      flex: 0.1,
      renderCell: (params) => (
        <Checkbox
          checked={selectedCompanies.includes(params.row._id)}
          onChange={() => handleSelectCompany(params.row._id)}
        />
      ),
    },
    // { field: "_id", headerName: "Id", flex: 0, hideable: false },
    { field: "name", headerName: "Tên công ty", flex: 0.3 },
    { field: "address", headerName: "Địa chỉ", flex: 0.4 },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 0.2,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
    },
    {
      field: "updatedAt",
      headerName: "Ngày cập nhật",
      flex: 0.2,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            color="warning"
            onClick={() => handleUpdateOpen(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              setCompanyToDelete(params.row._id);
              setConfirmDeleteOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Name"
          variant="outlined"
          size="small"
          value={searchName}
          onChange={handleSearchNameChange}
        />
        <TextField
          label="Address"
          variant="outlined"
          size="small"
          value={searchAddress}
          onChange={handleSearchAddressChange}
        />
        <Button variant="outlined" color="warning" onClick={getData}>
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
          disabled={selectedCompanies.length === 0}
        >
          Xóa các công ty đã chọn
        </Button>
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={companies}
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
          onSortModelChange={handleSortModelChange}
          getRowId={(row) => row._id}
          // Hiệu ứng tìm kiếm và lọc
          filterMode="client"
          // checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          // Hiệu ứng hover và đường viền
          sx={{
            boxShadow: 3,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          // Hiệu ứng cho thanh pagination
          pagination
          // paginationComponent={CustomPagination} // Tùy chọn pagination component
          // Hiển thị số dòng đã chọn
          showCellVerticalBorder
          showColumnVerticalBorder
          slots={{
            toolbar: GridToolbar, // Hiệu ứng Toolbar với filter, export, v.v.
          }}
        />
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <CompanyModal
            open={open}
            handleClose={handleClose}
            isEditMode={isEditMode}
            currentCompany={currentCompany}
            handleSubmit={handleSubmit}
          />
        </Box>
      </Modal>

      <Dialog
        open={confirmAddOpen}
        onClose={() => setConfirmAddOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition} // Hiệu ứng chuyển đổi
        fullWidth // Đặt full width
        maxWidth="sm" // Đặt kích thước tối đa
        PaperProps={{
          elevation: 24, // Hiệu ứng đổ bóng
          sx: {
            borderRadius: 4, // Bo tròn các góc
            padding: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận thêm công ty"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có muốn thêm công ty không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmAddOpen(false)}
            color="secondary"
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "error.main", color: "white" },
            }} // Hiệu ứng hover
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              setOpen(true);
              setConfirmAddOpen(false);
            }}
            color="primary"
            variant="outlined" // Thêm variant để đổi kiểu nút
            autoFocus
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "primary.dark" },
            }} // Hiệu ứng hover
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition} // Hiệu ứng chuyển đổi
        fullWidth
        maxWidth="sm"
        PaperProps={{
          elevation: 24, // Hiệu ứng đổ bóng
          sx: {
            borderRadius: 4,
            padding: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận xóa công ty"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có muốn xóa công ty không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            color="secondary"
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "##ebfcfc", color: "#69b6ff" },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (companyToDelete) {
                handleDelete(companyToDelete);
              }
              setConfirmDeleteOpen(false);
            }}
            color="warning"
            variant="outlined"
            autoFocus
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "#f7fcd7" },
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyList;
