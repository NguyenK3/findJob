"use client"

import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Select, MenuItem, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import { format } from "date-fns";
import ResumeModal from './app.admin.resumeModal';
import { useMediaQuery, useTheme } from '@mui/material';

const statuses = ["PENDING", "REVIEWING", "APPROVED", "REJECTED"];

const ResumeTable = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<IResume[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const access_token = session?.access_token;
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inside your component:
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const fetchJobs = async () => {
    try {
      const jobsResponse = await fetch(`http://localhost:8000/api/v1/jobs`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      const jobsData = await jobsResponse.json();
      setJobs(jobsData.data.result);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  }

  const handleChangeStatus = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as string);
    fetchResumes(event.target.value as string);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setPage(0);
    await fetchJobs()
  };

  const fetchCompanies = async () => {
    try {
      const companiesResponse = await fetch(`http://localhost:8000/api/v1/companies`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      const companiesData = await companiesResponse.json();
      setCompanies(companiesData.data.result);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchResumes = async (status?: string) => {
    try {
      const query = new URLSearchParams({
        current: (page + 1).toString(),
        pageSize: rowsPerPage.toString(),
        ...(status && { status: `/${status}/i` }),
      });

      const response = await fetch(`http://localhost:8000/api/v1/resumes/?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setRows(data.data.result);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const fetchData = async () => {
    await fetchCompanies();
    await fetchJobs();
    await fetchResumes(status);
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage]);

  const jobMap = jobs.reduce((acc, job) => {
    if (job._id) {
      acc[job._id] = job.name;
    }
    return acc;
  }, {} as Record<string, string>);

  const companyMap = companies.reduce((acc, company) => {
    if (company._id) {
      acc[company._id] = company.name;
    }
    return acc;
  }, {} as Record<string, string>);

  const handleResumeClick = (resume: IResume) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };
  
  // Define responsive columns
  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: 'Id',
      flex: isSmallScreen ? 0.5 : isMediumScreen ? 1 : 1.5,
      renderCell: (params) => (
        <Button onClick={() => handleResumeClick(params.row)}>
          {params.value}
        </Button>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: isSmallScreen ? 1 : 1.5,
      renderCell: (params) => params.value,
    },
    {
      field: 'companyId',
      headerName: 'Company',
      flex: isSmallScreen ? 1 : isMediumScreen ? 1.5 : 2,
      renderCell: (params) => companyMap[params.value] || params.value,
    },
    {
      field: 'jobId',
      headerName: 'Job',
      flex: isSmallScreen ? 1 : isMediumScreen ? 1.5 : 2,
      renderCell: (params) => jobMap[params.value] || params.value,
    },
    {
      field: 'status',
      headerName: 'Trạng Thái',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'CreatedAt',
      flex: isSmallScreen ? 0.7 : 1,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
    },
    {
      field: 'updatedAt',
      headerName: 'UpdatedAt',
      flex: isSmallScreen ? 0.7 : 1,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* Filter Section */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Trạng Thái"
            select
            value={status}
            onChange={handleChangeStatus}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              <em>Chọn level</em>
            </MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" startIcon={<SearchIcon />}>Tìm kiếm</Button>
          <Button variant="outlined" startIcon={<RefreshIcon />}>Làm lại</Button>
        </Box>
      </Box>

      {/* DataGrid Section */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={{ page, pageSize: rowsPerPage }}
          pageSizeOptions={[10, 25, 50]}
          rowCount={totalCount}
          paginationMode="server"
          onPaginationModelChange={(model) => {
            handleChangePage(model.page);
            handleChangeRowsPerPage(model.pageSize);
          }}
          getRowId={(row) => row._id}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            boxShadow: 3,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Box>

      {/* Resume Modal */}
      {selectedResume && (
        <ResumeModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resume={selectedResume}
          jobMap={jobMap}
          companyMap={companyMap}
          onStatusChange={fetchData} // Pass the fetchData function as a prop
        />
      )}
    </Container>
  );
};

export default ResumeTable;