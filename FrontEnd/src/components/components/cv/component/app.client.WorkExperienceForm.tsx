import React from "react";
import { Box, Typography } from "@mui/material";

interface WorkExperienceProps {
    experiences: {
        company: string;
        position: string;
        dateRange: string;
        description: string;
    }[];
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ experiences }) => {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                padding: 2,
                borderRadius: 2,
                boxShadow: 1,
                marginBottom: 4,
            }}
        >
            {experiences.map((exp, index) => (
                <Box key={index} mb={2}>
                    <Typography variant="h6">{exp.company}</Typography>
                    <Typography variant="body1">{exp.position}</Typography>
                    <Typography variant="body2" color="primary">
                        {exp.dateRange}
                    </Typography>
                    <Typography variant="body2">{exp.description}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default WorkExperience;