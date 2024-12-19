import React, { useState, useEffect } from 'react';
import {
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Menu,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const ManageUserPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [resumeData, setResumeData] = useState<IResume[]>([]);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const { data: session } = useSession();
  const access_token = session?.access_token;
  const [formData, setFormData] = useState<IUser>({
    _id: '',
    name: '',
    email: '',
    age: 0,
    gender: '',
    address: '',
    role: { _id: '', name: '' },
    company: { _id: '', name: '' },
    deletedAt: null,
    permissions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [password, setPassword] = useState<string>('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (companyId: string) => {
    const selectedCompany = companies.find(company => company._id === companyId);
    setFormData((prev) => ({
      ...prev,
      company: { _id: companyId, name: selectedCompany?.name || '' },
    }));
    setAnchorEl(null);
  };

  const fetchResumes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resumes/by-user`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // console.log('User data:', data.data);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  };

  const handleSubmit = async (updatedFormData: IUser) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      // console.log('Response:', updatedFormData);

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      console.log('User updated successfully:', data);
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
        console.log('User data:', userData);
        setFormData({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          age: userData.age,
          gender:
            userData.gender === "male"
              ? "Nam"
              : userData.gender === "female"
                ? "Nữ"
                : "Khác",
          address: userData.address,
          role: userData.role ? userData.role._id : '',
          company: userData.company || { _id: "", name: "" },
          permissions: userData.permissions || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          deletedAt: userData.deletedAt || null,
          updatedAt: userData.updatedAt || new Date().toISOString(),
        });
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCompanies(data.data.result);
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
    <Box
      sx={{
        p: 3,
        backgroundColor: 'background.default',
        color: 'text.primary',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Quản lý tài khoản
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        sx={{
          mb: 3,
          '.MuiTab-root': {
            fontWeight: 'medium',
            transition: 'all 0.3s',
            '&:hover': {
              color: 'primary.dark',
            },
          },
          '.Mui-selected': {
            color: 'primary.main',
            fontWeight: 'bold',
          },
        }}
      >
        <Tab label="Rải CV" />
        <Tab label="Cập nhật thông tin" />
        <Tab label="Thay đổi mật khẩu" />
      </Tabs>

      {tabIndex === 0 && (
        <Box sx={{ mt: 2 }}>
          <TableContainer sx={{ borderRadius: 2, boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Công Ty</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Tên Job</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ngày rải CV</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Chi tiết</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(resumeData) && resumeData.map((data, index) => (
                  <TableRow key={data._id} sx={{ '&:hover': { backgroundColor: 'grey.100' } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{typeof data.companyId === 'object' ? data.companyId.name : data.companyId}</TableCell>
                    <TableCell>{typeof data.jobId === 'object' ? data.jobId.name : data.jobId}</TableCell>
                    <TableCell>{data.status}</TableCell>
                    <TableCell>{data.createdAt ? new Date(data.createdAt).toLocaleDateString() : ''}</TableCell>
                    <TableCell>
                      <Link
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/resume/${data?.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          color: 'primary.main',
                          fontWeight: 'medium',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {data?.url}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Cập nhật thông tin
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
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
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Chọn Công Ty
              </Typography>
              <Button
                aria-controls={open ? 'company-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                fullWidth
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  padding: '10px',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                {formData.company?.name || 'Chọn công ty'}
              </Button>
              <Menu
                id="company-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                  sx: {
                    maxHeight: 300,
                    width: '300px',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                  },
                }}
              >
                {companies?.length > 0 ? (
                  companies.map((company) => (
                    <MenuItem
                      key={company._id}
                      value={company._id}
                      onClick={() => handleClose(company._id || '')}
                      sx={{
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                      }}
                    >
                      {company.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có công ty nào</MenuItem>
                )}
              </Menu>
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
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit(formData)}
              sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 3,
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
        <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          Thay đổi mật khẩu content goes here.
        </Typography>
      )}

      {cvUrl && (
        <Dialog open={Boolean(cvUrl)} onClose={() => setCvUrl(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
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
            <iframe src={cvUrl} width="100%" height="600px" title="User CV" style={{ border: 'none' }} />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ManageUserPage;