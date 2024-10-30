import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import JobModal from './app.admin.jobModal';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { NumericFormat } from 'react-number-format';

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmcm9tIHNlcnZlciIsInN1YiI6IlRva2VuIGxvZ2luIiwiX2lkIjoiNjcxYjA0MTU5ZmMwNGU3NjZiY2ZhNGViIiwiZW1haWwiOiJrYWJhbm9wcm9AZ21haWwuY29tIiwibmFtZSI6IkknbSBLYWJhTm9Qcm8iLCJyb2xlIjp7Il9pZCI6IjY3MWIwNDE1OWZjMDRlNzY2YmNmYTRlNSIsIm5hbWUiOiJTVVBFUl9BRE1JTiJ9LCJpYXQiOjE3MzAxMTc3MjYsImV4cCI6MTczMDIwNDEyNn0.EnQ6KoYA0vBDoV3d2T54kgj-wQgSkoKjIhy79YF1uFk";

const fetchJobs = async (): Promise<IJob[]> => {
    const response = await fetch('http://localhost:8000/api/v1/jobs/',
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        }
    );
    if (!response.ok) {
        throw new Error('Failed to fetch jobs');
    }
    return response.json();
};

const createJob = async (job: IJob): Promise<IJob> => {
    const response = await fetch('http://localhost:8000/api/v1/jobs/', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
    });
    if (!response.ok) {
        throw new Error('Failed to create job');
    }
    return response.json();
};

const updateJob = async (id: string, job: IJob): Promise<IJob> => {
    const response = await fetch(`http://localhost:8000/api/v1/jobs/`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
    });
    if (!response.ok) {
        throw new Error('Failed to update job');
    }
    return response.json();
};

const deleteJob = async (id: string): Promise<void> => {
    const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete job');
    }
};

const JobTable: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [currentJob, setCurrentJob] = useState<IJob | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      const data = await fetchJobs();
      setJobs(data);
    };
    loadJobs();
  }, []);

  const handleCreateJob = async (job: IJob) => {
    const newJob = await createJob(job);
    setJobs([...jobs, newJob]);
    setOpenModal(false);
  };

  const handleUpdateJob = async (job: IJob) => {
    if (job._id) {
      const updatedJob = await updateJob(job._id, job);
      setJobs(jobs.map((j) => (j._id === job._id ? updatedJob : j)));
      setOpenModal(false);
    } else {
      console.error('Job ID is undefined');
    }
  };

  const handleDeleteJob = async (id: string) => {
    await deleteJob(id);
    setJobs(jobs.filter((job) => job._id !== id));
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'STT', width: 70 },
    { field: 'name', headerName: 'Tên Job', width: 200 },
    { field: 'salary', headerName: 'Mức lương', width: 150, renderCell: (params) => <NumericFormat value={params.value} displayType={'text'} thousandSeparator={true} /> },
    { field: 'level', headerName: 'Level', width: 150 },
    { field: 'isActive', headerName: 'Trạng thái', width: 150, renderCell: (params) => (params.value ? 'Active' : 'Inactive') },
    { field: 'createdAt', headerName: 'CreatedAt', width: 150 },
    { field: 'updatedAt', headerName: 'UpdatedAt', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => {
            setCurrentJob(params.row);
            setIsEditMode(true);
            setOpenModal(true);
          }}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteJob(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>Danh sách Jobs</Typography>

      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <TextField label="Tên Job" variant="outlined" size="small" />
        <NumericFormat
          customInput={TextField}
          label="Mức lương"
          variant="outlined"
          size="small"
          thousandSeparator={true}
          prefix={''}
        />
        <Select label="Level" size="small" defaultValue="">
          <MenuItem value="Junior">Junior</MenuItem>
          <MenuItem value="Mid">Mid</MenuItem>
          <MenuItem value="Senior">Senior</MenuItem>
        </Select>
        <Button variant="contained">Tìm kiếm</Button>
        <Button variant="outlined">Làm lại</Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setCurrentJob(null);
          setIsEditMode(false);
          setOpenModal(true);
        }}>
          Thêm mới
        </Button>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={jobs}
          columns={columns}
          paginationModel={{ pageSize: 5, page: 0 }}
          pageSizeOptions={[5]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      </Box>

      <JobModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={isEditMode ? handleUpdateJob : handleCreateJob}
        job={currentJob}
      />
    </Container>
  );
};

export default JobTable;