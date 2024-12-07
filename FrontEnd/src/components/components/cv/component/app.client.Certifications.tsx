import React from "react";
import { Box, Typography } from "@mui/material";

interface CertificationsProps {
    certifications: string[];
}

const Certifications: React.FC<CertificationsProps> = ({ certifications }) => {
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
            {certifications.map((cert, index) => (
                <Typography key={index} variant="body2">
                    {cert}
                </Typography>
            ))}
        </Box>
    );
};

export default Certifications;