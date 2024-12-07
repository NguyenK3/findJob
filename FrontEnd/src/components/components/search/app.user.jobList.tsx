import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Grid,
  CircularProgress,
  TextField,
  Button,
  PaginationItem,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import JobDetail from "./app.user.jobDetail";
import SearchBar from "./app.user.searchBar";
import Pagination from "@mui/material/Pagination";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import dayjs from "dayjs";

const JobCard = ({ job, onClick }: { job: IJob; onClick: () => void }) => {
  // Bên trong component
  const startDate = job.startDate ? dayjs(job.startDate) : null;
  const endDate = job.endDate ? dayjs(job.endDate) : null;

  // Logic cho startDate
  let startDateDisplay = 'N/A';
  if (startDate) {
    if (startDate.isSame(dayjs(), 'day')) {
      startDateDisplay = 'Đã tạo hôm nay';
    } else if (startDate.isAfter(dayjs())) {
      startDateDisplay = `Sẽ bắt đầu vào ${startDate.format('DD/MM/YYYY')}`;
    } else {
      const daysSinceStart = dayjs().diff(startDate, 'day');
      if (daysSinceStart < 5) {
        startDateDisplay = `Đã tạo ${startDate.fromNow()}`;
      } else {
        startDateDisplay = `Ngày đăng ${startDate.format('DD/MM/YYYY')}`;
      }
    }
  }

  // Logic cho endDate
  let endDateDisplay = 'N/A';
  if (endDate) {
    if (endDate.isSame(dayjs(), 'day')) {
      endDateDisplay = 'Kết thúc hôm nay';
    } else if (endDate.isBefore(dayjs())) {
      const daysSinceEnd = dayjs().diff(endDate, 'day');
      if (daysSinceEnd < 7) {
        endDateDisplay = `Đã kết thúc ${endDate.fromNow()}`;
      } else {
        endDateDisplay = `Đã kết thúc vào ${endDate.format('DD/MM/YYYY')}`;
      }
    } else {
      const daysUntilEnd = endDate.diff(dayjs(), 'day');
      if (daysUntilEnd < 7) {
        endDateDisplay = `Kết thúc ${endDate.fromNow()}`;
      } else {
        endDateDisplay = `Ngày kết thúc ${endDate.format('DD/MM/YYYY')}`;
      }
    }
  }
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
        height: "100%",  // Đảm bảo chiều cao 100%
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 8,
          transform: "translateY(-5px)",
          bgcolor: "#F5F5F5",
        },
        minHeight: "320px",
      }}
      onClick={onClick}
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

      {/* Location, Salary, and Time */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

        {/* Hiển thị ngày tạo hoặc đã tạo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {startDateDisplay}
          </Typography>
        </Box>

        {/* Hiển thị ngày kết thúc hoặc kết thúc sau */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {endDateDisplay}
          </Typography>
        </Box>
      </Box>

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

  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchSkills, setSearchSkills] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 8,
  });

  const handleJobClick = (job: IJob) => {
    setSelectedJob(job);
  };

  const fetchJobs = async (
    // access_token: string,
    current: number,
    pageSize: number,
    skills?: string,
    salary?: number,
    location?: string,
    name?: string
  ): Promise<IJob[]> => {
    const query = new URLSearchParams({
      current: current.toString(),
      pageSize: pageSize.toString(),
      ...(skills && { skills: `/${skills}/i` }),
      ...(salary && { minSalary: salary.toString() }),
      ...(location && { location: `/${location}/i` }),
      ...(name && { name: `/${name}/i` }),
    });

    const response = await fetch(
      `http://localhost:8000/api/v1/jobs/?${query.toString()}`,
      {
        headers: {
          // Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(response);

    // console.log(response);
    // if (response.status === 401) {
    //   // Redirect to login page
    //   window.location.href = "/auth/signin";
    //   return [];
    // }

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const data = await response.json();
    setTotal(data.data.meta.total);
    return data.data.result;
  };

  const handleSearch = async (
    city: string,
    keyword: string,
    jobName: string,
    skills: string,
    salary: string
  ) => {
    if (session?.access_token) {
      setLoading(true);
      try {
        const data = await fetchJobs(
          // session.access_token,
          paginationModel.page,
          paginationModel.pageSize,
          skills,
          undefined, // Không truyền tham số salary vào API
          city !== "all" ? city : undefined,
          jobName
        );
        if (salary) {
          const filteredJobs = data.filter((job) => job.salary >= parseInt(salary));
          setJobs(filteredJobs);
        }
        else if (skills) {
          const filteredJobs = data.filter((job) => job.skills.includes(skills));
          setJobs(filteredJobs);
        }
        else if (city) {
          const filteredJobs = data.filter((job) => job.location.includes(city))
          setJobs(filteredJobs);
        }
        // console.log(jobName)
        // else if (jobName) {
        //   const filteredJobs = data.filter((job) => job.location.includes(jobName))
        //   setJobs(filteredJobs);
        // }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs(
          // session.access_token,
          paginationModel.page,
          paginationModel.pageSize,
        );
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [session, paginationModel]);

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <Box maxWidth="inherit" margin="0" p={2}>
      {!selectedJob && <SearchBar onSearch={handleSearch} />}
      {selectedJob ? (
        <JobDetail job={selectedJob} />
      ) : (
        <>
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={3} key={job._id}>
                <JobCard job={job} onClick={() => handleJobClick(job)} />
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(total / paginationModel.pageSize)}
            page={paginationModel.page}
            onChange={(event, value) =>
              setPaginationModel((prev) => ({ ...prev, page: value }))
            }
            color="primary"
            sx={{ mt: 3, display: "flex", justifyContent: "center" }}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                disabled={
                  (item.type === "next" &&
                    paginationModel.page >=
                    Math.ceil(total / paginationModel.pageSize)) ||
                  (item.type === "previous" && paginationModel.page <= 1)
                }
              />
            )}
          />
        </>
      )}
    </Box>
  );
};

export default JobList;