import React, { useState } from "react";
import { Box, Typography, Avatar, Grid, Link, Button } from "@mui/material";
import { CalendarToday, Email, LocationOn, Phone } from "@mui/icons-material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface PersonalInfoProps {
    name: string;
    dob: string;
    email: string;
    phone: string;
    linkedin: string;
    address: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
    name,
    dob,
    email,
    phone,
    linkedin,
    address,
}) => {
    const [avatar, setAvatar] = useState<string | null>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                padding: 3,
                borderRadius: 2,
                boxShadow: 1,
                marginBottom: 4,
            }}
        >
            {/* Phần tên và avatar */}
            <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                {/* Tên nằm bên trái */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                        {name}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                        Thông tin liên hệ
                    </Typography>
                    {/* Các thông tin còn lại */}
                    <Grid container spacing={3}>
                        {/* Ngày sinh và Số điện thoại */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <CalendarToday sx={{ mr: 1 }} />
                                <Typography variant="body2">{dob}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Phone sx={{ mr: 1 }} />
                                <Typography variant="body2">{phone}</Typography>
                            </Box>
                        </Grid>

                        {/* Địa chỉ và Email */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Email sx={{ mr: 1 }} />
                                <Typography variant="body2">{email}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <LocationOn sx={{ mr: 1 }} />
                                <Typography variant="body2">{address}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Avatar nằm bên phải */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        src={avatar || ""}
                        sx={{
                            width: 96,
                            height: 96,
                            border: '4px solid #3f51b5',
                            mb: 2,
                        }}
                    />
                    <Button variant="contained" component="label">
                        Upload Avatar
                        <input type="file" hidden onChange={handleAvatarChange} />
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <LinkedInIcon sx={{ mr: 1 }} />
                        <Link href={linkedin} target="_blank" rel="noopener" sx={{ textDecoration: 'none' }}>
                            <Typography variant="body2">{linkedin}</Typography>
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PersonalInfo;