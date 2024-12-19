import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  useTheme,
  SelectChangeEvent,
  Menu,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

interface UserDialogProps {
  open: boolean;
  handleClose: () => void;
  handleCreate: (formData: any) => void;
  handleUpdate: (formData: any) => void;
  user: IUser | null;
  isEditMode: boolean;
  companies: ICompany[];
  roles: IRole[];
  roleId: string
}

const UserDialog = ({
  open,
  handleClose,
  handleCreate,
  handleUpdate,
  user,
  isEditMode,
  companies,
  roles,
  roleId,
}: UserDialogProps) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    _id: "",
    email: "",
    name: "",
    password: "",
    age: 0,
    gender: "",
    role: "",
    company: {
      _id: "",
      name: "",
    },
    address: "",
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (user) {
      // var companyId = user.company?._id;
      // var companyName = user.company?.name;
      setFormData({
        _id: user?._id || "",
        email: user.email,
        password: "",
        name: user.name,
        age: user.age,
        gender:
          user.gender === "male"
            ? "Nam"
            : user.gender === "female"
              ? "Nữ"
              : "Khác",
        role: roleId || "",
        company: user.company || { _id: "", name: "" },
        address: user.address,
      });
    } else {
      setFormData({
        _id: "",
        email: "",
        name: "",
        password: "",
        age: 0,
        gender: "",
        role: "",
        company: {
          _id: "",
          name: "",
        },
        address: "",
      });
    }
  }, [user, roles]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
      | SelectChangeEvent<string>,
  ) => {
    const { name, value } = e.target;
    if (name === "company") {
      const selectedCompany = companies.find(
        (company) => company._id === value,
      );
      setFormData((prev) => ({
        ...prev,
        company: selectedCompany
          ? { _id: selectedCompany._id || "", name: selectedCompany.name }
          : { _id: "", name: "" },
      }));
    } else if (name === "role") {
      const selectedRole = roles.find((role) => role._id === value);
      setFormData((prev) => ({
        ...prev,
        role: selectedRole?._id || "",
      }));
      // console.log(formData);
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Name should not be empty");
      return;
    }
    if (!formData.role) {
      alert("Role must be selected");
      return;
    }

    if (!formData.company._id) {
      alert("Company must be selected");
      return;
    }
    if (isEditMode) {
      handleUpdate(formData);
    } else {
      handleCreate(formData);
    }
    setFormData({
      _id: "",
      email: "",
      name: "",
      password: "",
      age: 0,
      gender: "",
      role: "",
      company: {
        _id: "",
        name: "",
      },
      address: "",
    });
    handleClose();
  };

  const [anchorModalEl, setAnchorModalEl] = useState<null | HTMLElement>(null);
  const openModal = Boolean(anchorEl);
  const handleModalClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleModalClose = (companyId: string) => {
    const selectedCompany = companies.find(company => company._id === companyId);
    setFormData((prev) => ({
      ...prev,
      company: { _id: companyId, name: selectedCompany?.name || '' },
    }));
    setAnchorEl(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2, // Rounded corners
          boxShadow: theme.shadows[10], // Enhance shadow
          transition: "transform 0.3s ease-in-out", // Smooth opening/closing transition
          transform: open ? "scale(1)" : "scale(0.95)", // Zoom effect
        },
      }}
    >
      <DialogTitle>{isEditMode ? "Cập nhật User" : "Tạo mới User"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isEditMode}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: theme.palette.background.paper,
                  "&:focus": {
                    boxShadow: theme.shadows[2],
                  },
                },
              }}
            />
          </Grid>
          {!isEditMode && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password || ""}
                onChange={handleChange}
                required
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên hiển thị"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
              select
              fullWidth
              label="Giới tính"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
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
              onClick={handleModalClick}
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
              anchorEl={anchorModalEl}
              open={openModal}
              onClose={() => setAnchorModalEl(null)}
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
                    onClick={() => handleModalClose(company._id || '')}
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
          <Grid item xs={12} sm={6}>
            <Select
              label="Vai trò"
              value={formData.role}
              name="role"
              onChange={handleChange}
              fullWidth
            >
              {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            "&:hover": {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.common.white,
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: theme.shadows[4],
              transform: "scale(1.05)",
            },
          }}
        >
          {isEditMode ? "Cập nhật" : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
