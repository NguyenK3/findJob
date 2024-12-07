import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { NumericFormat } from "react-number-format";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (job: IJob) => Promise<void>;
  job: IJob | null;
  companies: ICompany[];
  jobId: string | null; // Thêm jobId vào props
  sizeObject: number
}

const JobModal: React.FC<JobModalProps> = ({
  open,
  onClose,
  onSave,
  job,
  companies = [], // Đảm bảo rằng companies luôn là một mảng
  jobId, // Nhận jobId từ props
  sizeObject
}) => {
  const [formData, setFormData] = useState({
    name: "",
    salary: 0,
    level: "Intern",
    isActive: false,
    skills: [] as string[],
    location: "",
    company: {
      _id: "",
      name: "",
      logo: "",
    },
    quantity: 0,
    startDate: dayjs(),
    endDate: dayjs(),
    description: "",
  });

  useEffect(() => {
    if (job) {
      setFormData({
        name: job.name || "",
        salary: job.salary || 0,
        level: job.level || "Intern",
        isActive: job.isActive || false,
        skills: job.skills || [],
        location: job.location || "",
        company: job.company
          ? { ...job.company, logo: job.company.logo || "" }
          : { _id: "", name: "", logo: "" },
        quantity: job.quantity || 0,
        startDate: job.startDate ? dayjs(job.startDate) : dayjs(),
        endDate: job.endDate ? dayjs(job.endDate) : dayjs(),
        description: job.description || "",
      });
    }
  }, [job]);

  useEffect(() => {
    console.log("size", sizeObject)
    if (sizeObject === 1) {
      // companies.forEach((company) => {
      //   console.log(company);
      // });
      // const companiesArray = JSON.stringify(companies); // Chuyển đổi JSON object sang array
      setFormData((prev) => ({
        ...prev,
        company: {
          _id: companies._id,
          name: companies.name,
          logo: companies.logo,
        },
      }));
      // console.log("selected Company", companiesArray);
    }

  }, [companies]);

  const handleSave = async () => {
    await onSave({
      ...formData,
      _id: jobId ?? undefined,
      startDate: formData.startDate.toDate(),
      endDate: formData.endDate.toDate(),
    }); // Thêm jobId vào formData khi lưu
    clearInputs();
  };

  const clearInputs = () => {
    setFormData({
      name: "",
      salary: 0,
      level: "Intern",
      isActive: false,
      skills: [],
      location: "",
      company: { _id: "", name: "", logo: "" },
      quantity: 0,
      startDate: dayjs(),
      endDate: dayjs(),
      description: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={() => {
          onClose();
          clearInputs();
        }}
        fullScreen
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          p={3}
          bgcolor="white"
          borderRadius={2}
          boxShadow={3}
          width="100%"
          height="100%"
          sx={{
            overflowY: "auto",
            "@media (max-width: 600px)": {
              p: 2,
            },
          }}
        >
          <Typography variant="h5" mb={2} textAlign="center">
            Thông tin công việc
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tên Job"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="dense"
                sx={{
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <NumericFormat
                customInput={TextField}
                label="Mức lương"
                name="salary"
                value={formData.salary}
                onValueChange={(values) =>
                  setFormData((prev) => ({
                    ...prev,
                    salary: Number(values.value),
                  }))
                }
                thousandSeparator={true}
                fullWidth
                margin="normal"
                sx={{
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                label="Level"
                name="level"
                value={formData.level}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    level: e.target.value,
                  }))
                }
                fullWidth
                margin="dense"
                sx={{
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
                }}
              >
                <MenuItem value="Intern">Intern</MenuItem>
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Mid">Mid</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
                <MenuItem value="Leader">Leader</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    color="primary"
                  />
                }
                label="Trạng thái"
                sx={{
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Kỹ năng yêu cầu"
                name="skills"
                value={formData.skills.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    skills: e.target.value
                      .split(",")
                      .map((skill) => skill.trim()),
                  }))
                }
                fullWidth
                margin="dense"
                sx={{
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Địa điểm"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                margin="dense"
                sx={{
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
                }}
              />
            </Grid>
            {companies.length > 1 && (
              <Grid item xs={12}>
                <Select
                  label="Công ty"
                  name="company"
                  value={formData.company._id}
                  onChange={(e) => {
                    const selectedCompany = companies.find(
                      (c) => c._id === e.target.value,
                    );
                    setFormData((prev) => ({
                      ...prev,
                      company: {
                        _id: selectedCompany?._id || "",
                        name: selectedCompany?.name || "",
                        logo: selectedCompany?.logo || "",
                      },
                    }));
                  }}
                  fullWidth
                  margin="dense"
                  sx={{
                    transition: "box-shadow 0.3s",
                    "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
                  }}
                >
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Số lượng tuyển"
                name="quantity"
                value={formData.quantity !== null ? formData.quantity : ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                fullWidth
                margin="dense"
                type="number"
                sx={{
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Ngày bắt đầu"
                value={formData.startDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: newValue || dayjs(),
                  }))
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Ngày kết thúc"
                value={formData.endDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: newValue || dayjs(),
                  }))
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                mt={2}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 2,
                  transition: "box-shadow 0.3s, transform 0.2s",
                  "&:hover": {
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <ReactQuill
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                  placeholder="Miêu tả job"
                  style={{ marginTop: "8px", marginBottom: "8px" }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              onClick={() => {
                onClose();
                clearInputs();
              }}
              color="secondary"
              sx={{
                mr: 2,
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              sx={{
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
};

export default JobModal;