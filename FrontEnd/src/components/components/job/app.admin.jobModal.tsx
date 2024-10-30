import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { NumericFormat } from 'react-number-format';

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (job: IJob) => void;
  job: IJob | null;
}

const JobModal: React.FC<JobModalProps> = ({ open, onClose, onSave, job }) => {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState<number | null>(null);
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (job) {
      setName(job.name);
      setSalary(job.salary);
      setLevel(job.level);
      setStatus(job.isActive ? 'Active' : 'Inactive');
      setStartDate(job.createdAt ? dayjs(job.createdAt) : null);
      setEndDate(job.updatedAt ? dayjs(job.updatedAt) : null);
    }
  }, [job]);

  const handleSave = () => {
    const newJob: IJob = {
      _id: job ? job._id : '',
      name,
      salary: salary || 0,
      level,
      isActive: status === 'Active',
      createdAt: startDate ? startDate.toDate().toISOString() : undefined,
      updatedAt: endDate ? endDate.toDate().toISOString() : undefined,
      skills: job ? job.skills : [],
      locations: job && Array.isArray(job.locations) ? job.locations.join(', ') : '',
      description: job ? job.description : '',
      quantity: job ? job.quantity : 0,
      startDate: startDate ? startDate.toDate() : new Date(),
      endDate: endDate ? endDate.toDate() : new Date(),
      company: job && typeof job.company === 'object' ? job.company : { _id: '', name: '' },
    };
    onSave(newJob);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose}>
        <Box p={3} bgcolor="white" borderRadius={2} boxShadow={3} maxWidth={600} mx="auto" mt={5}>
          <TextField
            label="Tên Job"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <NumericFormat
            customInput={TextField}
            label="Mức lương"
            value={salary}
            onValueChange={(values) => setSalary(Number(values.value))}
            thousandSeparator={true}
            fullWidth
            margin="normal"
          />
          <Select
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Junior">Junior</MenuItem>
            <MenuItem value="Mid">Mid</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
          </Select>
          <Select
            label="Trạng thái"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
          <Box display="flex" gap={2}>
            <DatePicker
              label="Ngày bắt đầu"
              value={startDate}
              onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
              slotProps={{
                textField: { fullWidth: true },
                actionBar: {
                  actions: ['clear'],
                },
              }}
            />
            <DatePicker
              label="Ngày kết thúc"
              value={endDate}
              onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
              slotProps={{
                textField: { fullWidth: true },
                actionBar: ({ wrapperVariant }) => ({
                  actions: wrapperVariant === 'desktop' ? [] : ['clear'],
                }),
              }}
            />
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Lưu
            </Button>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default JobModal;