"use client";

import { Box, Typography, Grid, Pagination } from "@mui/material";
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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const fetchCompanies = async (currentPage: number, pageSize: number) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/companies/?current=${currentPage}&pageSize=${pageSize}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch companies");
            }
            const data = await response.json();
            setCompanies(data.data.result);
            setTotalCount(data.data.totalCount);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    useEffect(() => {
        fetchCompanies(page, pageSize);
    }, [page, pageSize]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

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

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                    count={Math.ceil(totalCount / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default CompanyList;