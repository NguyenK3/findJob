import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
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
}: UserDialogProps) => {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: "",
        name: user.name,
        age: user.age,
        gender:
          user.gender === "MALE"
            ? "Nam"
            : user.gender === "FEMALE"
            ? "Nữ"
            : "Khác",
        role: user.role?._id || "",
        company: user.company || { _id: "", name: "" },
        address: user.address,
      });
    } else {
      setFormData({
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
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "company") {
      const selectedCompany = companies.find(
        (company) => company._id === value
      );
      setFormData((prev) => ({
        ...prev,
        company: selectedCompany
          ? { _id: selectedCompany._id || "", name: selectedCompany.name }
          : { _id: "", name: "" },
      }));
    } else {
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
                required={!isEditMode} // Chỉ yêu cầu mật khẩu khi tạo mới
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
            <TextField
              select
              fullWidth
              label="Vai trò"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="">Chọn vai trò</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Thuộc Công Ty"
              name="company"
              value={formData.company._id}
              onChange={handleChange}
              required
            >
              <MenuItem value="">Chọn công ty</MenuItem>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditMode ? "Cập nhật" : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;