import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useSession } from 'next-auth/react';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobName: string;
  userName: string;
  companyId: string;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ open, onClose, jobId, jobName, userName, companyId }) => {
  const [name, setName] = useState(userName);
  const [cvFileName, setCvFileName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const { data: session } = useSession();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCvFileName(event.target.files[0].name);
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('fileUpload', file); // Use 'fileUpload' as the parameter name

    try {
      const response = await fetch('http://localhost:8000/api/v1/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "folder_type": "resume"
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.fileName; // Assuming the API returns the uploaded file URL
      } else {
        throw new Error('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload your CV.');
      return;
    }

    try {
      const fileUrl = await uploadFile(file);

      const formData = new URLSearchParams();
      formData.append('url', fileUrl);
      formData.append('companyId', companyId);
      formData.append('jobId', jobId);

      const response = await fetch('http://localhost:8000/api/v1/resumes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData.toString(),
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        onClose();
      } else {
        alert('Failed to submit application.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="resume-modal-title" maxWidth="sm" fullWidth>
      <DialogTitle id="resume-modal-title">{jobName}</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            padding: 2,
            backgroundColor: '#fff',
          }}
        >
          {/* Name Field */}
          <TextField
            label="Họ và Tên"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* CV Upload Section */}
          <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'error.main' }}>
            CV ứng tuyển *
          </FormLabel>
          <RadioGroup defaultValue="new" sx={{ marginBottom: 2 }}>
            <FormControlLabel
              value="new"
              control={<Radio color="error" />}
              label="Tải lên CV mới"
            />
          </RadioGroup>
          <Button variant="outlined" component="label">
            Choose File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {cvFileName && (
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
              {cvFileName}
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary">
            Hỗ trợ định dạng .doc, .docx, .pdf, không chứa mật khẩu bảo vệ, dung lượng dưới 3MB
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button variant="contained" color="error" onClick={handleSubmit}>
          Gửi CV của tôi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResumeModal;