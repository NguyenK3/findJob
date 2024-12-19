'use client';
import { Grid, Box, Card, CardContent, Typography, Avatar, Divider, Link } from '@mui/material';
import { LocationOn, Email } from '@mui/icons-material';
import { styled } from '@mui/system';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const StyledCard = styled(Card)({
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    height: '100%',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '12px', // Góc bo tròn
    '&:hover': {
        transform: 'translateY(-8px)', // Hover card
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    },
});

const StyledAvatar = styled(Avatar)({
    transition: 'transform 0.3s ease',
    borderRadius: '0', // Logo hình vuông
    width: 100,
    height: 100,
    objectFit: 'contain',
    padding: '10px',
    backgroundColor: '#fff',
    '& img': {
        objectFit: 'contain',
        width: '100%',
        height: '100%',
    },
    '&:hover': {
        transform: 'scale(1.1)', // Hiệu ứng hover logo
    },
});

const StyledDescription = styled(Box)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    WebkitLineClamp: 3, // Giới hạn số dòng hiển thị
    lineHeight: '1.6',
});

interface ICompany {
    _id: string;
    name: string;
    logo: string;
    address: string;
    description: string;
    email?: string;
}

const TopCompany: React.FC<{ companyId: string }> = ({ companyId }) => {
    const [company, setCompany] = useState<ICompany | null>(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies/${companyId}`,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch company');
                }
                const data = await response.json();
                setCompany(data.data);
            } catch (error) {
                console.error('Error fetching company:', error);
            }
        };

        fetchCompany();
    }, [companyId]);

    if (!company) {
        return null; // Hoặc bạn có thể hiển thị một spinner loading ở đây
    }

    const truncateParagraph = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...'; // Cắt bớt nếu nội dung quá dài
        }
        return text;
    };

    const sanitizeAndExtractParagraphs = (html: string, maxParagraphs: number) => {
        const sanitizedHTML = DOMPurify.sanitize(html);
        const div = document.createElement('div');
        div.innerHTML = sanitizedHTML;
        const paragraphs = Array.from(div.querySelectorAll('p')).map(
            (p) => p.textContent?.trim() || ''
        );

        // Cắt bớt nội dung từng thẻ <p> nếu cần
        const truncatedParagraphs = paragraphs.slice(0, maxParagraphs).map((para) =>
            truncateParagraph(para, 100) // Giới hạn 100 ký tự mỗi thẻ
        );

        return truncatedParagraphs;
    };

    const descriptionBullets = sanitizeAndExtractParagraphs(company.description, 2);
    const router = useRouter();

    const handleClick = () => {
        router.push(`/company/${company._id}`);
    };

    return (
        <StyledCard onClick={handleClick} style={{ cursor: 'pointer' }}>
            <CardContent>
                {/* Logo và tên công ty */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <StyledAvatar src={company.logo} alt={company.name} />
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 2,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            transition: 'color 0.3s ease',
                            '&:hover': { color: '#007BFF' },
                        }}
                    >
                        {company.name}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Description */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#555' }}>
                        Giới thiệu công ty:
                    </Typography>
                    <StyledDescription>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {descriptionBullets.map((line, index) => (
                                <li key={index}>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        {line}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </StyledDescription>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Địa chỉ */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ mr: 1, color: '#007BFF' }} />
                    <Typography variant="body2" color="text.secondary">
                        {company.address}
                    </Typography>
                </Box>

                {/* Email */}
                {company.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email fontSize="small" sx={{ mr: 1, color: '#007BFF' }} />
                        <Link
                            href={`mailto:${company.email}`}
                            underline="hover"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { color: '#007BFF' },
                            }}
                        >
                            {company.email}
                        </Link>
                    </Box>
                )}
            </CardContent>
        </StyledCard>
    );
};

const TopCompaniesList: React.FC = () => {
    const [topCompanies, setTopCompanies] = useState<string[]>([]);

    useEffect(() => {
        const fetchTopCompanies = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies/top/companies?criteria=highSalary&limit=3`,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch top companies');
                }
                const data = await response.json();
                const uniqueCompanyIds = Array.from(new Set((data.data as ICompany[]).slice(0, 3).map((company: ICompany) => company._id)));
                setTopCompanies(uniqueCompanyIds);
            } catch (error) {
                console.error('Error fetching top companies:', error);
            }
        };

        fetchTopCompanies();
    }, []);

    console.log(topCompanies); // Move the console.log statement here

    return (
        <Grid container spacing={3}>
            {topCompanies.map((companyId) => (
                <Grid item xs={12} sm={6} md={4} key={companyId}>
                    <TopCompany companyId={companyId} />
                </Grid>
            ))}
        </Grid>
    );
};

export default TopCompaniesList;