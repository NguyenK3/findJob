import React from "react";
import { Box, Typography, Chip } from "@mui/material";

interface SoftSkillsProps {
    skills: string[];
}

const SoftSkills: React.FC<SoftSkillsProps> = ({ skills }) => {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                padding: 2,
                borderRadius: 2,
                boxShadow: 1,
                marginBottom: 2,
            }}
        >
            {skills.map((skill, index) => (
                <Chip
                    key={index}
                    label={skill}
                    sx={{ margin: 0.5 }}
                    color="secondary"
                    variant="outlined"
                />
            ))}
        </Box>
    );
};

export default SoftSkills;