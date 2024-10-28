"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Stable Grid component
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import the CSS for the Quill editor

interface CompanyModalProps {
  open: boolean;
  handleClose: () => void;
  isEditMode: boolean;
  currentCompany: any;
  handleSubmit: (companyData: any) => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  open,
  handleClose,
  isEditMode,
  currentCompany,
  handleSubmit,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // for image preview
  const [value, setValue] = useState("");
  const [companyData, setCompanyData] = useState({
    name: "",
    address: "",
    description: "",
    logo: null,
  });

  useEffect(() => {
    if (isEditMode && currentCompany) {
      setCompanyData(currentCompany);
      setValue(currentCompany.description || "");
      setPreview(currentCompany.logo || null);
    } else {
      setCompanyData({
        name: "",
        address: "",
        description: "",
        logo: null,
      });
      setValue("");
      setPreview(null);
    }
  }, [isEditMode, currentCompany]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile)); // create a preview URL for the uploaded image
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const logo = file ? await convertFileToBase64(file) : companyData.logo;
    handleSubmit({ ...companyData, description: value, logo });
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        transition: "transform 0.4s ease-out, opacity 0.3s ease-out",
        "& .MuiDialog-paper": {
          borderRadius: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogContent sx={{ padding: 4 }}>
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
          {isEditMode ? "Cập nhật Company" : "Tạo mới Company"}
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            {/* Tên công ty */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên công ty"
                placeholder="Nhập tên công ty"
                required
                name="name"
                value={companyData.name}
                onChange={handleChange}
              />
            </Grid>

            {/* Custom Upload Logo */}
            <Grid item xs={12} sm={2}>
              <Box
                sx={{
                  width: 120, // smaller width
                  height: 120, // smaller height
                  border: "2px dashed rgba(0, 0, 0, 0.2)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                  overflow: "hidden", // hide overflow when image is larger
                  transition: "border 0.3s ease",
                  "&:hover": {
                    borderColor: "#1976d2",
                  },
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                  id="upload-button"
                />
                <label
                  htmlFor="upload-button"
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "100%", // make the image fit within the box
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <AddIcon
                        sx={{ fontSize: 30, color: "rgba(0, 0, 0, 0.54)" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(0, 0, 0, 0.54)", marginTop: 1 }}
                      >
                        Upload
                      </Typography>
                    </>
                  )}
                </label>
              </Box>
              {file && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {file.name}
                </Typography>
              )}
            </Grid>

            {/* Địa chỉ */}
            <Grid item xs={12} sm={10}>
              <TextField
                fullWidth
                label="Địa chỉ"
                placeholder="Nhập địa chỉ công ty"
                required
                multiline
                rows={2}
                name="address"
                value={companyData.address}
                onChange={handleChange}
              />
            </Grid>

            {/* Miêu tả */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Miêu tả
              </Typography>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  placeholder: "Miêu tả về công ty",
                  p: 2,
                  label: "Miêu tả",
                  transition: "box-shadow 0.3s, transform 0.2s",
                  "&:hover": {
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <ReactQuill theme="snow" value={value} onChange={setValue} />
              </Box>
            </Grid>

            {/* Submit button */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="outlined"
                color="warning"
                sx={{
                  padding: "10px 20px",
                  borderRadius: 2,
                  transition: "box-shadow 0.3s, transform 0.3s",
                  "&:hover": {
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {isEditMode ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModal;
