import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  Grid,
  TextField,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSession } from 'next-auth/react';
import { Button } from '@mui/material';

const ManageUserModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [resumeData, setResumeData] = useState<IResume[]>([]);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const { data: session } = useSession();
  const access_token = session?.access_token;
  const [formData, setFormData] = useState<IUser>({
    _id: '',
    name: '',
    email: '',
    // password: '',
    age: 0,
    gender: '',
    address: '',
    role: { _id: '', name: '' },
    company: { _id: '', name: '' },
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [password, setPassword] = useState<string>('');

  const fetchResumes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/resumes/by-user', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setResumeData(data.data || []);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      setResumeData([]);
    }
  };

  const fetchUserById = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  };

  const handleSubmit = async (updatedFormData: IUser) => {

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      console.log('Response:', updatedFormData);

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      console.log('User updated successfully:', data);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchResumes();
      const userId = session?.user._id;
      const userData = await fetchUserById(userId || '');
      if (userData) {
        setFormData({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          age: userData.age,
          gender: userData.gender,
          address: userData.address,
          // password: password || '',
          role: userData.role ? userData.role._id : '',
          company: userData.company ? { _id: userData.company._id, name: userData.company.name } : { _id: '', name: '' },
          deletedAt: userData.deletedAt || null,
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
        });
      }

    };

    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/companies', {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCompanies(data.data.result)
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        setCompanies([]); // Set companies as an empty array on error
      }
    };

    fetchData();
    fetchCompanies();
  }, [access_token, session, password]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleChange = (e: | React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
    | SelectChangeEvent<string>,) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResumeClick = (cvUrl: string) => {
    setCvUrl(cvUrl);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Quản lý tài khoản
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Rải CV" />
          <Tab label="Cập nhật thông tin" />
          <Tab label="Thay đổi mật khẩu" />
        </Tabs>
        {tabIndex === 0 && (
          <Box sx={{ mt: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Công Ty</TableCell>
                    <TableCell>Tên Job</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày rải CV</TableCell>
                    <TableCell>Chi tiết</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(resumeData) && resumeData.map((data, index) => (
                    <React.Fragment key={data._id}>
                      <TableRow>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{typeof data.companyId === 'object' ? data.companyId.name : data.companyId}</TableCell>
                        <TableCell>{typeof data.jobId === 'object' ? data.jobId.name : data.jobId}</TableCell>
                        <TableCell>{data.status}</TableCell>
                        <TableCell>{data.createdAt ? new Date(data.createdAt).toLocaleDateString() : ''}</TableCell>
                        <TableCell>
                          {/* <Link onClick={() => handleResumeClick(data)}>Chi Tiết</Link> */}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cập nhật thông tin
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tuổi"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Giới tính"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  select
                  required
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Công ty"
                  name="company"
                  value={(() => {
                    return companies.some(company => company._id === formData?.company?._id) ? formData?.company?._id : '';
                  })()}
                  onChange={handleChange}
                  select
                  required
                >
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(formData)}
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Cập nhật
              </Button>
            </Box>
          </Box>
        )}
        {tabIndex === 2 && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Thay đổi mật khẩu content goes here.
          </Typography>
        )}
      </DialogContent>
      {cvUrl && (
        <Dialog open={Boolean(cvUrl)} onClose={() => setCvUrl(null)} maxWidth="md" fullWidth>
          <DialogTitle>
            CV
            <IconButton
              aria-label="close"
              onClick={() => setCvUrl(null)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <iframe src={cvUrl} width="100%" height="600px" title="User CV" />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default ManageUserModal;