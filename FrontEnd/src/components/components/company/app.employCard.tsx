'use client'
import { Box, Card, CardContent, Typography, Chip, Avatar } from '@mui/material';
import { LocationOn, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '100%',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
  },
});

const StyledAvatar = styled(Avatar)({
  transition: 'transform 0.3s ease',
  borderRadius: '0', // Logo hình vuông
  width: 100, // Kích thước logo
  height: 100,
  objectFit: 'contain', // Đảm bảo hình ảnh không bị méo
  padding: '10px', // Thêm padding nếu cần để tạo không gian xung quanh logo
  backgroundColor: '#fff', // Đặt nền trắng nếu cần để logo nổi bật
  '& img': {
    objectFit: 'contain', // Đảm bảo hình ảnh luôn giữ tỷ lệ
    width: '100%', // Đảm bảo logo được căn chỉnh và phủ toàn bộ phần tử avatar
    height: '100%',
  },
  '&:hover': {
    transform: 'scale(1.1)', // Hiệu ứng phóng to logo khi hover
  },
});

interface EmployerCardProps {
  logo: string;
  company: string;
  skills: string[];
  locations: string[];
  jobCount: number;
}

const EmployerCard = ({ logo, company, skills, locations, jobCount }: EmployerCardProps) => {
  return (
    <StyledCard>
      <CardContent>
        {/* Employer Logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <StyledAvatar
            src={logo}
            alt={company}
            sx={{ margin: '0 auto' }}
          />
        </Box>

        {/* Employer Information */}
        <Typography
          variant="h6"
          textAlign="center"
          gutterBottom
          sx={{
            transition: 'color 0.3s ease',
            '&:hover': {
              color: '#f50057',
            },
          }}
        >
          {company}
        </Typography>

        {/* Job Tags */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {skills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              variant="outlined"
              sx={{
                margin: '4px',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          ))}
        </Box>

        {/* Locations */}
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
          {locations.join(' - ')}
        </Typography>

        {/* Job Count */}
        <Typography
          variant="body1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 1,
            color: 'green',
            fontWeight: 'bold',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          {jobCount} Việc làm <ArrowForward fontSize="small" sx={{ ml: 0.5 }} />
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default EmployerCard;