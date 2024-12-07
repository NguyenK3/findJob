import React from "react";
import { Box, Typography, Chip } from "@mui/material";

interface TechnicalSkillsProps {
    skills: string[];
}

const TechnicalSkills: React.FC<TechnicalSkillsProps> = ({ skills }) => {
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
            {skills.map((skill, index) => (
                <Chip key={index} label={skill} sx={{ margin: 0.5 }} />
            ))}
        </Box>
    );
};

export default TechnicalSkills;