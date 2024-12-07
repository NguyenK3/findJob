import React from "react";
import { Box, Typography } from "@mui/material";

interface LanguagesProps {
    languages: string[];
}

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
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
            {languages.map((language, index) => (
                <Typography key={index} variant="body2">
                    {language}
                </Typography>
            ))}
        </Box>
    );
};

export default Languages;