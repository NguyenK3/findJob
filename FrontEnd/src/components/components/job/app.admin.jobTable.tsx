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
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import JobModal from "./app.admin.jobModal";
import { format } from "date-fns";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridToolbar, GridValueGetter,
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
  const [searchCompany, setSearchCompany] = useState<string | null>(null);
  const [isActive, setisActive] = useState(false);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [searchSkills, setSearchSkills] = useState("");
  const [searchSalary, setSearchSalary] = useState<number | null>(null);
  const [searchLevel, setSearchLevel] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState<string | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: session } = useSession();
  const access_token = session?.access_token;

  const fetchJobs = async (
    current: number,
    pageSize: number,
    skills?: string,
    salary?: number,
    company?: string,
    isActive?: boolean,
    level?: string,
    location?: string, // Thêm tham số location
  ): Promise<{ jobs: IJob[], total: number }> => {
    const query = new URLSearchParams({
      current: current.toString(),
      pageSize: pageSize.toString(),
      ...(skills && { skills: `/${skills}/i` }),
      ...(salary && { salary: salary.toString() }),
      ...(company && { "company._id": `/${company}/i` }),
      ...(level && { level }),
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
    let jobs = data.data.result;

    if (isActive) {
      const currentDate = new Date();
      jobs = jobs.filter((job: IJob) => new Date(job.endDate) >= currentDate);
    }

    if (salary) {
      const res = await fetchJobs(current, pageSize, undefined, undefined, undefined, undefined, undefined, undefined);
      jobs = res.jobs.filter((job: IJob) => job.salary >= salary);
      return { jobs, total: res.total };
    }

    if (location) {
      const res = await fetchJobs(current, pageSize, undefined, undefined, undefined, undefined, undefined, undefined);
      jobs = res.jobs.filter((job: IJob) => job.location.includes(location));
      console.log(jobs);
      // return { jobs, total: res.total };
    }

    return { jobs, total: data.data.meta.total };
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

  const [totalJobs, setTotalJobs] = useState(0); // Add state to keep track of total job count

  // Cập nhật useEffect để bao gồm searchLocation
  useEffect(() => {
    const loadJobs = async () => {
      const { jobs, total } = await fetchJobs(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchSkills,
        searchSalary ?? undefined,
        searchCompany ?? undefined,
        isActive,
        searchLevel ?? undefined,
        searchLocation ?? undefined, // Thêm searchLocation vào đây
      );
      setJobs(jobs);
      setTotalJobs(total);
    };
    loadJobs();
  }, [paginationModel, searchSkills, searchSalary, searchCompany, isActive, searchLevel, searchLocation]);

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
      setJobs(data.jobs);
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
        setJobs(data.jobs);
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
      setJobs(data.jobs);
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

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const jobToUpdate = jobs.find((job) => job._id === id);
      if (jobToUpdate) {
        const currentDate = new Date();
        if (new Date(jobToUpdate.endDate) < currentDate) {
          setSnackbar({
            open: true,
            message: "Cannot activate job past its end date",
            severity: "error",
          });
          await updateJob(id, { ...jobToUpdate, isActive: false });
          return
        }
        else {
          await updateJob(id, { ...jobToUpdate, isActive: !isActive });
        }
      }
      const data = await fetchJobs(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchSkills,
        searchSalary ?? undefined,
      );
      setJobs(data.jobs);
      setSnackbar({
        open: true,
        message: `Job ${!isActive ? "activated" : "deactivated"} successfully`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to ${!isActive ? "activate" : "deactivate"} job`,
        severity: "error",
      });
    }
  };

  const handleSearch = () => {
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "Id", flex: 0.5 },
    { field: "name", headerName: "Tên Job", flex: 1.5 },
    {
      field: "location",
      headerName: "Vị trí",
      flex: 2,
    },
    {
      field: "company",
      headerName: "Công ty",
      flex: 1,
      renderCell: (params) => params.row?.company?.name
    },
    {
      field: "skills",
      headerName: "Kỹ năng",
      flex: 1.5,
      // valueGetter: (params) => params.row.skills.join(", "
    },
    {
      field: "salary",
      headerName: "Mức lương",
      flex: 1,
      renderCell: (params) => (
        <NumericFormat
          value={params.value}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
    { field: "level", headerName: "Level", flex: 1 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      flex: 0.75,
      renderCell: (params) => (
        <IconButton
          color={params.value ? "primary" : "default"}
          onClick={() => handleToggleActive(params.row._id, params.value)}
        >
          {params.value ? <ToggleOnIcon /> : <ToggleOffIcon />}
        </IconButton>
      ),
    },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      flex: 1,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 1,
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
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Danh sách Jobs
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/** Nhóm đầu tiên: Kỹ năng, mức lương, địa điểm, và nút "Tìm kiếm", "Làm lại" */}
        <Grid container spacing={2} item xs={12} direction="row" alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Kỹ năng"
              variant="outlined"
              size="small"
              value={searchSkills}
              onChange={(e) => setSearchSkills(e.target.value)}
              sx={{
                transition: "all 0.3s ease",
                "&:hover, &:focus-within": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transform: "scale(1.03)",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <NumericFormat
              customInput={TextField}
              label="Mức lương"
              variant="outlined"
              size="small"
              thousandSeparator
              prefix=""
              value={searchSalary || ""}
              onValueChange={(values) => setSearchSalary(Number(values.value))}
              sx={{
                transition: "all 0.3s ease",
                "&:hover, &:focus-within": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transform: "scale(1.03)",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Địa điểm"
              variant="outlined"
              size="small"
              value={searchLocation || ""}
              onChange={(e) => setSearchLocation(e.target.value)}
              sx={{
                transition: "all 0.3s ease",
                "&:hover, &:focus-within": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transform: "scale(1.03)",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Select
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              size="small"
              sx={{
                minWidth: 200,
                transition: "all 0.3s ease",
                "&:hover, &:focus-within": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transform: "scale(1.03)",
                },
              }}
            >
              <MenuItem value="">
                <em>Tất cả công ty</em>
              </MenuItem>
              {companies.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Select
              value={searchLevel}
              onChange={(e) => setSearchLevel(e.target.value)}
              size="small"
              sx={{
                minWidth: 200,
                transition: "all 0.3s ease",
                "&:hover, &:focus-within": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transform: "scale(1.03)",
                },
              }}
            >
              <MenuItem value="">
                <em>Tất cả level</em>
              </MenuItem>
              {["Intern", "Junior", "Mid", "Senior", "Lead"].map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setisActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Job còn thời hạn"
            />
          </Grid>
        </Grid>
      </Grid>

      <Box gap={2} display="flex" justifyContent="flex-end" marginBottom={3}>
        <Button
          variant="outlined"
          onClick={handleSearch}
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
              transform: "scale(1.05)",
            },
          }}
        >
          Tìm kiếm
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setSearchSkills("");
            setSearchSalary(null);
            setSearchCompany(null);
            setSearchLevel(null);
            setisActive(false);
            handleSearch();
          }}
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          Làm lại
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentJob(null);
            setIsEditMode(false);
            setOpenModal(true);
          }}
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
              transform: "scale(1.05)",
            },
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
          rowCount={totalJobs} // Add totalJobs state to keep track of total job count
          paginationMode="server" // Enable server-side pagination
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
        sizeObject={0} // Add the sizeObject property with a default value
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