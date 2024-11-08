import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import JobModal from "./app.admin.jobModal";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { NumericFormat } from "react-number-format";
import { useSession } from "next-auth/react";

const JobTable: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [currentJob, setCurrentJob] = useState<IJob | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [searchSkills, setSearchSkills] = useState("");
  const [searchSalary, setSearchSalary] = useState<number | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: session } = useSession();
  const access_token = session?.access_token;

  const fetchJobs = async (
    current: number,
    pageSize: number,
    skills?: string,
    salary?: number,
  ): Promise<IJob[]> => {
    const query = new URLSearchParams({
      current: current.toString(),
      pageSize: pageSize.toString(),
      ...(skills && { skills: `/^${skills}/i` }),
      ...(salary && { salary: salary.toString() }),
    });

    const response = await fetch(
      `http://localhost:8000/api/v1/jobs/?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const data = await response.json();
    return data.data.result;
  };

  const createJob = async (job: IJob): Promise<IJob> => {
    const response = await fetch("http://localhost:8000/api/v1/jobs/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error("Failed to create job");
    }
    return response.json();
  };

  const updateJob = async (id: string, job: IJob): Promise<IJob> => {
    const response = await fetch(`http://localhost:8000/api/v1/jobs/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error("Failed to update job");
    }
    return response.json();
  };

  const deleteJob = async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:8000/api/v1/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete job");
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

  useEffect(() => {
    const loadJobs = async () => {
      const data = await fetchJobs(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchSkills,
        searchSalary ?? undefined,
      );
      setJobs(data);
    };
    loadJobs();
  }, [paginationModel, searchSkills, searchSalary]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };
    loadCompanies();
  }, []);

  const handleCreateJob = async (job: IJob) => {
    try {
      await createJob(job);
      const data = await fetchJobs(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchSkills,
        searchSalary ?? undefined,
      );
      setJobs(data);
      setOpenModal(false);
      setSnackbar({
        open: true,
        message: "Job created successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create job",
        severity: "error",
      });
    }
  };

  const handleUpdateJob = async (job: IJob) => {
    if (job._id) {
      try {
        await updateJob(job._id, job);
        const data = await fetchJobs(
          paginationModel.page + 1,
          paginationModel.pageSize,
          searchSkills,
          searchSalary ?? undefined,
        );
        setJobs(data);
        setOpenModal(false);
        setSnackbar({
          open: true,
          message: "Job updated successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to update job",
          severity: "error",
        });
      }
    } else {
      console.error("Job ID is undefined");
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob(id);
      const data = await fetchJobs(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchSkills,
        searchSalary ?? undefined,
      );
      setJobs(data);
      setSnackbar({
        open: true,
        message: "Job deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete job",
        severity: "error",
      });
    }
  };

  const handleSearch = () => {
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "Id", flex: 0.5 },
    { field: "name", headerName: "Tên Job", flex: 1 },
    {
      field: "location",
      headerName: "Vị trí",
      flex: 0.5,
    },
    {
      field: "salary",
      headerName: "Mức lương",
      flex: 0.5,
      renderCell: (params) => (
        <NumericFormat
          value={params.value}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
    { field: "level", headerName: "Level", flex: 0.3 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      flex: 0.3,
      renderCell: (params) => (params.value ? "Active" : "Inactive"),
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 0.75,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "updatedAt",
      headerName: "UpdatedAt",
      flex: 0.75,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.75,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => {
              setCurrentJob(params.row);
              setIsEditMode(true);
              setOpenModal(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteJob(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Danh sách Jobs
      </Typography>

      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <TextField
          label="Kỹ năng"
          variant="outlined"
          size="small"
          value={searchSkills}
          onChange={(e) => setSearchSkills(e.target.value)}
        />
        <NumericFormat
          customInput={TextField}
          label="Mức lương"
          variant="outlined"
          size="small"
          thousandSeparator={true}
          prefix={""}
          value={searchSalary !== null ? searchSalary : ""}
          onValueChange={(values) => setSearchSalary(Number(values.value))}
        />
        <Button variant="contained" onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setSearchSkills("");
            setSearchSalary(null);
            handleSearch();
          }}
        >
          Làm lại
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentJob(null);
            setIsEditMode(false);
            setOpenModal(true);
          }}
        >
          Thêm mới
        </Button>
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={jobs}
          columns={columns}
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 25]}
          getRowId={(row) => row._id}
          onPaginationModelChange={(model) => setPaginationModel(model)}
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
          showCellVerticalBorder
          showColumnVerticalBorder
          pagination
          autoHeight
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar, // Hiệu ứng Toolbar với filter, export, v.v.
          }}
        />
      </Box>

      <JobModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        companies={companies}
        onSave={isEditMode ? handleUpdateJob : handleCreateJob}
        job={currentJob}
        jobId={currentJob?._id || ""}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobTable;
