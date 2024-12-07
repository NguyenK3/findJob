import React from "react";
import { Box, Typography } from "@mui/material";

interface SummaryProps {
    text: string;
}

const Summary: React.FC<SummaryProps> = ({ text }) => {
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
            <Typography variant="body2">{text}</Typography>
        </Box>
    );
};

export default Summary;
