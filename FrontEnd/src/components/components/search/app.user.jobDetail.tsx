import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Box, Button, Card, Chip, IconButton, Typography } from '@mui/material';
import ResumeModal from './app.user.resumeModal';

interface JobDetailProps {
  job: IJob;
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal

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
            <Button variant="contained" color="error" sx={{ mr: 2, px: 3, py: 1 }}>
              Đăng nhập để xem mức lương
            </Button>
            <Button variant="contained" color="primary" sx={{ px: 3, py: 1 }} onClick={handleApplyClick}>
              Ứng tuyển
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Ngày Đăng {job.createdAt ? format(new Date(job.createdAt), 'dd/MM/yyyy') : 'N/A'}
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