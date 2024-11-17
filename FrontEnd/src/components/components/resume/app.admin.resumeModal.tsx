import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  Button,
  IconButton,
  SelectChangeEvent,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import Link from '@mui/material/Link';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  resume: IResume | null;
  jobMap: Record<string, string>;
  companyMap: Record<string, string>;
  onStatusChange: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ open, onClose, resume, jobMap, companyMap, onStatusChange }) => {
  const [status, setStatus] = React.useState(resume?.status || "PENDING");
  const { data: session } = useSession();
  const access_token = session?.access_token;

  const handleChangeStatus = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value as string);
  };

  const jobId = typeof resume?.jobId === 'object' ? resume.jobId._id : resume?.jobId;
  const companyId = typeof resume?.companyId === 'object' ? resume.companyId._id : resume?.companyId;

  const handleStatusChange = async () => {
    if (!resume) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/resumes/${resume._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      console.log('Status updated:', data);
      onStatusChange();
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    // <Dialog
    //   open={open}
    //   onClose={onClose}
    //   maxWidth="sm"
    //   fullWidth
    //   sx={{
    //     '& .MuiDialog-paper': {
    //       borderRadius: 3,
    //       boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
    //       transition: 'all 0.3s ease-in-out',
    //       transform: open ? 'scale(1)' : 'scale(0.95)',
    //     },
    //   }}
    // >
    //   <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //     Thông Tin Resume
    //     <IconButton
    //       onClick={onClose}
    //       sx={{
    //         transition: 'transform 0.2s ease',
    //         '&:hover': {
    //           transform: 'rotate(90deg)',
    //         },
    //       }}
    //     >
    //       <CloseIcon />
    //     </IconButton>
    //   </DialogTitle>
    //   <DialogContent dividers sx={{ padding: 3 }}>
    //     <Grid container spacing={2}>
    //       <Grid item xs={6}>
    //         <Typography variant="body1" fontWeight="bold">Email</Typography>
    //         <Typography variant="body2">{resume?.email}</Typography>
    //       </Grid>
    //       <Grid item xs={6}>
    //         <Typography variant="body1" fontWeight="bold">Trạng thái</Typography>
    //         <Select
    //           value={status}
    //           onChange={handleChangeStatus}
    //           fullWidth
    //           variant="outlined"
    //           size="small"
    //           sx={{
    //             transition: 'border-color 0.2s',
    //             '&:hover': {
    //               borderColor: 'primary.main',
    //             },
    //           }}
    //         >
    //           <MenuItem value="PENDING">PENDING</MenuItem>
    //           <MenuItem value="APPROVED">APPROVED</MenuItem>
    //           <MenuItem value="REJECTED">REJECTED</MenuItem>
    //         </Select>
    //       </Grid>
    //       <Grid item xs={6}>
    //         <Typography variant="body1" fontWeight="bold">Tên Job</Typography>
    //         <Typography variant="body2">{jobMap[jobId ?? ''] || jobId}</Typography>
    //       </Grid>
    //       <Grid item xs={6}>
    //         <Typography variant="body1" fontWeight="bold">Tên Công Ty</Typography>
    //         <Typography variant="body2">{companyMap[companyId ?? ''] || companyId}</Typography>
    //       </Grid>
    //       <Grid item xs={6}>
    //         <Typography variant="body1" fontWeight="bold">Ngày tạo</Typography>
    //         <Typography variant="body2">
    //           {resume?.createdAt ? format(new Date(resume.createdAt), "dd/MM/yyyy") : ''}
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={6}>
    //         <Typography variant="body1" fontWeight="bold">Ngày sửa</Typography>
    //         <Typography variant="body2">
    //           {resume?.updatedAt ? format(new Date(resume.updatedAt), "dd/MM/yyyy") : ''}
    //         </Typography>
    //       </Grid>
    //     </Grid>
    //     <Box>
    //       <Typography variant="body1" fontWeight="bold">
    //         Link CV: <Link href={`http://localhost:8000/images/resume/${resume?.url}`} target="_blank" rel="noopener noreferrer">{resume?.url}</Link>
    //       </Typography>
    //     </Box>
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       fullWidth
    //       onClick={handleStatusChange}
    //       sx={{
    //         mt: 3,
    //         paddingY: 1.5,
    //         fontWeight: 'bold',
    //         transition: 'all 0.3s ease',
    //         '&:hover': {
    //           backgroundColor: 'primary.dark',
    //           transform: 'scale(1.02)',
    //           boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
    //         },
    //       }}
    //     >
    //       Change Status
    //     </Button>
    //   </DialogContent>
    // </Dialog>
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          transform: open ? 'scale(1)' : 'scale(0.95)',
          opacity: open ? 1 : 0.9,
          backgroundColor: '#fafafa',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          paddingBottom: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            letterSpacing: 0.5,
            color: '#333',
          }}
        >
          Thông Tin Resume
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            transition: 'transform 0.3s ease, background-color 0.3s',
            '&:hover': {
              transform: 'rotate(90deg)',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          padding: 4,
          backgroundColor: '#fff',
          borderRadius: '0 0 4px 4px',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Email
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {resume?.email}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Trạng thái
            </Typography>
            <Select
              value={status}
              onChange={handleChangeStatus}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 0 4px rgba(0, 123, 255, 0.5)',
                },
              }}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="APPROVED">APPROVED</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Tên Job
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {jobMap[jobId ?? ''] || jobId}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Tên Công Ty
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {companyMap[companyId ?? ''] || companyId}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Ngày tạo
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {resume?.createdAt
                ? format(new Date(resume.createdAt), 'dd/MM/yyyy')
                : ''}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Ngày sửa
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {resume?.updatedAt
                ? format(new Date(resume.updatedAt), 'dd/MM/yyyy')
                : ''}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography
            variant="body1"
            fontWeight="bold"
            gutterBottom
            sx={{ wordBreak: 'break-all' }}
          >
            Link CV:{' '}
            <Link
              href={`http://localhost:8000/images/resume/${resume?.url}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {resume?.url}
            </Link>
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleStatusChange}
          sx={{
            mt: 3,
            paddingY: 1.5,
            fontWeight: 'bold',
            letterSpacing: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.02)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Change Status
        </Button>
      </DialogContent>
    </Dialog>

  );
};

export default ResumeModal;
