import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Grid,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IJob } from "@/types/backend.d.ts";

const JobCard = ({ job }: { job: IJob }) => {
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
            transition: "transform 0.3s ease",
            borderRadius: "0", // Logo hình vuông
            width: 100, // Kích thước logo
            height: 100,
            objectFit: "contain", // Đảm bảo hình ảnh không bị méo
            padding: "10px", // Thêm padding nếu cần để tạo không gian xung quanh logo
            backgroundColor: "#fff", // Đặt nền trắng nếu cần để logo nổi bật
            "& img": {
              objectFit: "contain", // Đảm bảo hình ảnh luôn giữ tỷ lệ
              width: "100%", // Đảm bảo logo được căn chỉnh và phủ toàn bộ phần tử avatar
              height: "100%",
            },
            "&:hover": {
              transform: "scale(0.7)", // Hiệu ứng phóng to logo khi hover
            },
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
            size="medium"
            sx={{
              marginRight: 0.5,
              marginBottom: 0.5,
              bgcolor: "#e3e2e1",
              color: "#264D59",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
              "&:hover": {
                bgcolor: "#ffc2a1",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const JobList = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
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
          const data = await fetchJobs(session.access_token, 1, 10);
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

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <Box maxWidth="inherit" margin="0" p={2}>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={job._id}>
            <JobCard job={job} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JobList;
