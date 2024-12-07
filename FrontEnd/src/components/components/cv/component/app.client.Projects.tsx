import React from "react";
import { Box, Typography } from "@mui/material";

interface ProjectsProps {
    projects: {
        name: string;
        description: string;
        link: string;
    }[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
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
            {projects.map((project, index) => (
                <Box key={index} mb={2}>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2">{project.description}</Typography>
                    <Typography
                        variant="body2"
                        color="primary"
                        component="a"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {project.link}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default Projects;
