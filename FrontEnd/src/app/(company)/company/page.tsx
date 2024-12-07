import CompanyList from "@/components/components/company/app.client.companyList"
import { Box, Container } from "@mui/material"

const ClientCompanyPage = () => {
    return (
        <Container
            maxWidth={false}
            sx={{
                mt: 4,
            }}
        >
            <Box
                sx={{
                    p: 2,
                    mb: 4,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <CompanyList />
            </Box>
        </Container>
    )
}

export default ClientCompanyPage