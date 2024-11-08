import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IJob } from "@/types/backend.d.ts";

const JobCard = ({
  job,
  onEdit,
}: {
  job: IJob;
  onEdit: (job: IJob) => void;
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      bgcolor="#FFFFFF"
      borderRadius={2}
      p={2}
      boxShadow={3}
      border="1px solid #FFFFFF"
      sx={{
        position: "relative",
        width: "100%",
        marginBottom: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 8,
          transform: "translateY(-5px)",
          bgcolor: "#F5F5F5",
        },
        minHeight: "320px",
      }}
    >
      {/* Icon Super Hot */}
      {job.isActive && (
        <Box
          position="absolute"
          top={8}
          right={8}
          bgcolor="#ee6b6e"
          color="white"
          px={1}
          py={0.5}
          borderRadius={1}
          display="flex"
          alignItems="center"
          sx={{
            fontSize: 12,
            fontWeight: "bold",
            animation: "pulse 1.5s infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <WhatshotIcon fontSize="small" sx={{ marginRight: 0.5 }} />
          SUPER HOT
        </Box>
      )}

      {/* Logo công ty */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={job.company.logo}
          alt={job.company.name}
          sx={{
            width: 60,
            height: 60,
            marginRight: 2,
            objectFit: "contain", // Ensure the logo fits within the avatar
            borderRadius: 1, // Optional: make the avatar square
          }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {job.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.company.name}
          </Typography>
        </Box>
      </Box>

      {/* Mức lương */}
      <Stack direction="row" alignItems="center" spacing={1} mt={1}>
        <MonetizationOnIcon fontSize="small" />
        <Typography variant="body2" color="text.primary">
          {job.salary
            ? `${job.salary.toLocaleString()} VND`
            : "Đăng nhập để xem mức lương"}
        </Typography>
      </Stack>

      {/* Địa điểm */}
      <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
        <LocationOnIcon fontSize="small" />
        <Typography variant="body2" color="text.secondary">
          {job.location}
        </Typography>
      </Stack>

      {/* Kỹ năng */}
      <Box mt={1}>
        {job.skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            size="small"
            sx={{
              marginRight: 0.5,
              marginBottom: 0.5,
              bgcolor: "#FFDAB9",
              color: "#FF6347",
              fontWeight: "bold",
            }}
          />
        ))}
      </Box>

      {/* Mô tả công việc */}
      <Box mt={1.5} color="text.secondary">
        <Typography
          variant="body2"
          component="div"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 3, // Limit to 3 lines
            textOverflow: "ellipsis",
          }}
        >
          {job.description}
        </Typography>
      </Box>

      {/* Edit Button */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <IconButton color="primary" onClick={() => onEdit(job)}>
          <EditIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const JobList = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { data: session } = useSession();

  const fetchJobs = async (
    access_token: string,
    current: number,
    pageSize: number,
    skills?: string,
    salary?: number,
  ): Promise<IJob[]> => {
    const query = new URLSearchParams({
      current: current.toString(),
      pageSize: pageSize.toString(),
      ...(skills && { skills: `/^${skills}/i` }),
      ...(salary && { salary: salary.toString() }),
    });

    const response = await fetch(
      `http://localhost:8000/api/v1/jobs/?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const data = await response.json();
    return data.data.result;
  };

  useEffect(() => {
    const loadJobs = async () => {
      if (session?.access_token) {
        try {
          const data = await fetchJobs(session.access_token, 1, 10); // Fetch the first page with 10 jobs
          setJobs(data);
        } catch (error) {
          console.error("Failed to fetch jobs:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadJobs();
  }, [session]);

  const handleEditJob = (job: IJob) => {
    setSelectedJob(job);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedJob(null);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box maxWidth="inherit" margin="0" p={2}>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={job._id}>
            <JobCard job={job} onEdit={handleEditJob} />
          </Grid>
        ))}
      </Grid>

      {selectedJob && (
        <JobModal
          open={openModal}
          onClose={handleCloseModal}
          job={selectedJob}
        />
      )}
    </Box>
  );
};

export default JobList;
