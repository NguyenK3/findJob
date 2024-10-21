"use client";
import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  TablePagination,
  Modal,
  Typography,
  TableSortLabel,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import style from "styled-jsx/style";
import { transform } from "next/dist/build/swc";
import CompanyModal from "./app.admin.companyModal";

const CompanyList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [companies, setCompanies] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getData();
  }, [searchName, searchAddress]);

  const getData = async () => {
    const access_token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmcm9tIHNlcnZlciIsInN1YiI6IlRva2VuIGxvZ2luIiwiX2lkIjoiNjcwZGY4MzgxMzI0MTBmNDM5MGViNzc2IiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJuYW1lIjoiSSdtIGFkbWluIiwicm9sZSI6eyJfaWQiOiI2NzBkZjgzODEzMjQxMGY0MzkwZWI3NzEiLCJuYW1lIjoiU1VQRVJfQURNSU4ifSwiaWF0IjoxNzI5NDc3Nzc3LCJleHAiOjE3Mjk1NjQxNzd9.JbO1QuG4be6TU5hbGGgaMSQyvHa1FBE2PLYw-XZVsy4";
    const res = await fetch("http://localhost:8000/api/v1/companies/", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    const d = await res.json();
    const filteredCompanies = d.data.result.filter(
      (company: ICompany) =>
        company.name.toLowerCase().includes(searchName.toLowerCase()) &&
        company.address.toLowerCase().includes(searchAddress.toLowerCase())
    );

    setCompanies(filteredCompanies);
  };

  const handleSearchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchName(event.target.value);
  };

  const handleSearchAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchAddress(event.target.value);
  };

  const handleReset = () => {
    setSearchName("");
    setSearchAddress("");
  };

  // Function to sort the table data
  const descendingComparator = (
    a: ICompany,
    b: ICompany,
    orderBy: keyof ICompany
  ) => {
    if ((b[orderBy] ?? "") < (a[orderBy] ?? "")) {
      return -1;
    }
    if ((b[orderBy] ?? "") > (a[orderBy] ?? "")) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order: "asc" | "desc", orderBy: keyof ICompany) => {
    return order === "desc"
      ? (a: ICompany, b: ICompany) => descendingComparator(a, b, orderBy)
      : (a: ICompany, b: ICompany) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (
    array: ICompany[],
    comparator: (a: ICompany, b: ICompany) => number
  ) => {
    const stabilizedThis: [ICompany, number][] = array.map((el, index) => [
      el,
      index,
    ]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("name"); // Default sorting by "name"
  // const [data, setData] = useState(initialData); // Removed as initialData is not defined

  const handleRequestSort = (property: keyof ICompany) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Form tìm kiếm */}
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
      </Box>

      {/* Bảng danh sách công ty */}
      <Paper sx={{ boxShadow: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    backgroundColor: "#f5f5f5", // Light background color for headers
                    fontWeight: "bold", // Bold text for headers
                    borderBottom: "2px solid #ccc", // Bottom border
                    transition: "background-color 0.3s ease", // Smooth transition on hover
                    textAlign: "center", // Center align text
                  },
                  "& th:hover": {
                    backgroundColor: "#e0e0e0", // Darker background on hover
                  },
                }}
              >
                <TableCell>STT</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "_id"}
                    direction={orderBy === "_id" ? order : "asc"}
                    onClick={() => handleRequestSort("_id")}
                  >
                    Id
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Tên công ty
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "address"}
                    direction={orderBy === "address" ? order : "asc"}
                    onClick={() => handleRequestSort("address")}
                  >
                    Địa chỉ
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleRequestSort("createdAt")}
                  >
                    Ngày tạo
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "updatedAt"}
                    direction={orderBy === "updatedAt" ? order : "asc"}
                    onClick={() => handleRequestSort("updatedAt")}
                  >
                    Ngày cập nhật
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {stableSort(
                companies.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ),
                getComparator(order, orderBy as keyof ICompany)
              ).map((company: ICompany, index) => (
                <TableRow
                  key={company._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "background-color 0.3s ease",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{company._id}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell>
                    {company.createdAt
                      ? new Date(company.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {company.updatedAt
                      ? new Date(company.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        "@media (max-width: 600px)": {
                          flexDirection: "column",
                          alignItems: "center",
                        },
                      }}
                    >
                      <IconButton
                        color="warning"
                        onClick={handleOpen}
                        sx={{
                          "&:hover": {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s",
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        sx={{
                          "&:hover": {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={companies.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Số hàng trên trang"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trên ${count !== -1 ? count : `nhiều hơn ${to}`}`
          }
        />
      </Paper>
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
          <CompanyModal open={open} handleClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
};

export default CompanyList;
