import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Summary from "./component/app.client.Summary";
import TechnicalSkills from "./component/app.client.TechnicalSkills";
import SoftSkills from "./component/app.client.SoftSkills";
import Certifications from "./component/app.client.Certifications";
import Languages from "./component/app.client.Languages";
import Projects from "./component/app.client.Projects";
import WorkExperience from "./component/app.client.WorkExperienceForm";
import PersonalInfo from "./component/app.client.PersonalInfo";
import Education from "./component/app.client.Education"; // Import Education component
import { Work, Code, Language, Star, School, Group } from "@mui/icons-material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";

interface ResumeProps {
  personalInfo: {
    name: string;
    dob: string;
    email: string;
    phone: string;
    linkedin: string;
    address: string;
  };
  summary: string;
  workExperience: {
    company: string;
    position: string;
    dateRange: string;
    description: string;
  }[];
  technicalSkills: string[];
  softSkills: string[];
  certifications: string[];
  languages: string[];
  projects: {
    name: string;
    description: string;
    link: string;
  }[];
  education: {
    institution: string;
    period: string;
    details: string;
  }[]; // Add education prop
}

const Resume: React.FC<ResumeProps> = ({
  personalInfo,
  summary,
  workExperience,
  technicalSkills,
  softSkills,
  certifications,
  languages,
  projects,
  education,
}) => {
  return (
    <Container sx={{
      maxWidth: "md", paddingY: 5,
      // backgroundImage: "url('https://image.slidesdocs.com/responsive-images/background/summer-lotus-and-willow-leaves-in-chinese-style-powerpoint-background_014c5098d7__960_540.jpg')",
      mb: 4,

    }}>
      {/* Personal Info Section */}
      <Box sx={{ mb: 4 }}>
        <PersonalInfo {...personalInfo} />
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            {/* Summary */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                <Code sx={{ mr: 1 }} /> Summary
              </Typography>
              <Summary text={summary} />
            </Box>

            {/* Languages */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                <Language sx={{ mr: 1 }} /> Languages
              </Typography>
              <Languages languages={languages} />
            </Box>

            {/* Technical Skills */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                <Star sx={{ mr: 1 }} /> Technical Skills
              </Typography>
              <TechnicalSkills skills={technicalSkills} />
            </Box>

            {/* Soft Skills */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                <Group sx={{ mr: 1 }} /> Soft Skills
              </Typography>
              <SoftSkills skills={softSkills} />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            {/* Work Experience */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                <Work sx={{ mr: 1 }} /> Work Experience
              </Typography>
              <WorkExperience experiences={workExperience} />
            </Box>

            {/* Education */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                <School sx={{ mr: 1 }} /> Education
              </Typography>
              <Education education={education} />
            </Box>

            {/* Certifications */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                <School sx={{ mr: 1 }} /> Certifications
              </Typography>
              <Certifications certifications={certifications} />
            </Box>

            {/* Projects */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                <DesktopWindowsIcon sx={{ mr: 1 }} /> Projects
              </Typography>
              <Projects projects={projects} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Resume;