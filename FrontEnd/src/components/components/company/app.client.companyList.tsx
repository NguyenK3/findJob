"use client";

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import EmployerCard from "./app.employCard";

interface ICompany {
    _id: string;
    name: string;
    logo: string;
    address: string;
    description: string;
}

const CompanyList = () => {
    const [companies, setCompanies] = useState<ICompany[]>([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/v1/companies/?current=1&pageSize=5",
                    {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch companies");
                }
                const data = await response.json();
                setCompanies(data.data.result);
                console.log(data)
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        fetchCompanies();
    }, []);

    return (
        <Box sx={{ py: 5 }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    mb: 3,
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        left: "50%",
                        bottom: "-10px",
                        width: "60px",
                        height: "4px",
                        backgroundColor: "#f50057",
                        transform: "translateX(-50%)",
                    },
                }}
            >
                Danh sách các công ty
            </Typography>

            <Grid container spacing={4}>
                {companies.map((company) => (
                    <Grid item xs={12} sm={6} md={4} key={company._id}>
                        <EmployerCard company={company} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CompanyList;