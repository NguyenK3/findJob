import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import React, { use, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Avatar, Box, Button, Card, Chip, IconButton, Typography } from '@mui/material';
import ResumeModal from './app.user.resumeModal';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useRouter } from 'next/navigation';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface JobDetailProps {
  job: IJob;
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const router = useRouter();

  const handleApplyClick = () => {
    setIsModalOpen(true); // Open modal when button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  const parseSections = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sections: { title: string; content: string }[] = [];
    let currentSection: { title: string; content: string } | null = null;

    doc.body.childNodes.forEach((node) => {
      if (node.nodeName === 'H2') {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { title: (node as HTMLElement).innerText, content: '' };
      } else if (currentSection) {
        currentSection.content += (node as Element).outerHTML;
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseSections(job.description);

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
      if (daysSinceStart < 7) {
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

  const handleSignInClick = () => {
    router.push('/auth/signin');
  }

  return (
    <Box
      sx={{
        maxWidth: '80%',
        margin: "auto",
        p: 4,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)' }
      }}
    >
      {/* Job Title and Company */}
      <Box sx={{ mb: 2 }}>
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
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {job.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {job.company?.name}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {session ? (
          <Button variant="contained" color="primary" sx={{ mr: 2, px: 3, py: 1 }} onClick={handleApplyClick}>
            Ứng tuyển
          </Button>
        ) : (
          <>
            <Button variant="contained" color="error" sx={{ mr: 2, px: 3, py: 1 }} onClick={handleSignInClick}>
              Đăng nhập để xem mức lương
            </Button>
          </>
        )}
        <IconButton color="secondary" aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
      </Box>

      {/* Location, Salary, and Time */}
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="text.secondary">{job.location}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalAtmIcon fontSize="small" color="success" />
          <Typography variant="body2" color="text.secondary">
            {new Intl.NumberFormat('vi-VN').format(job.salary)}
          </Typography>
        </Box>
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

      {/* Skills */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {job.skills.map((skill, index) => (
          <Chip key={index} label={skill} variant="outlined" color="primary" />
        ))}
      </Box>

      {/* Job Description Sections */}
      {sections.map((section, index) => (
        <Card
          key={index}
          sx={{
            p: 3,
            mb: 3,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.02)' }
          }}
        >
          <Typography variant="h6" gutterBottom color="primary">
            {section.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </Card>
      ))}

      {/* Resume Modal */}
      {isModalOpen && (
        <ResumeModal
          open={isModalOpen}
          onClose={handleCloseModal}
          jobId={job._id || ''}
          jobName={job.name}
          userName={session?.user?.name || ''}
          companyId={job.company?._id || ''}
        />
      )}
    </Box>
  );
};

export default JobDetail;