import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

interface EducationItem {
    institution: string;
    period: string;
    details: string;
}

interface EducationProps {
    education: EducationItem[];
}

const Education: React.FC<EducationProps> = ({ education = [] }) => {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                padding: 4,
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <Grid container spacing={2}>
                {education.map((item, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        key={index}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#f5f5f5",
                            padding: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 1,
                                color: "#1976d2",
                            }}
                        >
                            <SchoolIcon fontSize="small" sx={{ marginRight: 1 }} />
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ color: "#1976d2" }}
                            >
                                {item.institution}
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                            {item.period}
                        </Typography>
                        <Typography variant="body2">{item.details}</Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Education;