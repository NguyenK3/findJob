import React, { useState, useEffect, useRef, useMemo, forwardRef, lazy, Suspense } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardMedia, Input } from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { useSession } from 'next-auth/react';
import ReactQuill from 'react-quill';


const CompanyInfo = () => {
    const ReactQuill =
        typeof window === 'object' ? require('react-quill') : undefined;
    const quillRef = useRef<ReactQuill | null>(null);
    // const ReactQuill = lazy(() => import('react-quill'))
    const [companyData, setCompanyData] = useState({
        name: '',
        address: '',
        logo: '',
        description: ''
    });

    const { data: session } = useSession();
    const access_token = session?.access_token;
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null); // for image preview

    const handleImageUpload = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files ? input.files[0] : null;
            if (file) {
                const formData = new FormData();
                formData.append("fileUpload", file);

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "folder_type": "company"
                    },
                    body: formData,
                });

                const data = await response.json();
                const quill = quillRef.current?.getEditor();
                const range = quill?.getSelection();
                // console.log(range)
                if (quill) {
                    const range = quill.getSelection();
                    console.log(range)
                    if (range) {
                        const encodedFileName = encodeURIComponent(data.data.fileName);
                        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/company/${encodedFileName}`;
                        quill.insertEmbed(range.index, "image", imageUrl);
                    }
                }
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', "strike"],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['image', "link",],
                [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }]
            ],
            handlers: {
                image: handleImageUpload
            }
        },
    }), [])

    useEffect(() => {
        const fetchUserDataById = async (id: string) => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                        }
                    }
                ); // Thay đổi URL API phù hợp
                const data = await response.json();
                // console.log(data);
                return data.data
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        }
        // Fetch company data from API
        const fetchCompanyDataById = async (id: string) => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                        }
                    }
                ); // Thay đổi URL API phù hợp
                const data = await response.json();
                setCompanyData({
                    name: data.data.name,
                    address: data.data.address,
                    logo: data.data.logo,
                    description: data.data.description
                });
                // console.log(data);
                return data.data
            } catch (error) {
                console.error('Failed to fetch company data:', error);
            }
        };
        const fetchData = async () => {
            const userId = session?.user?._id;
            if (!userId) {
                console.error('User ID is undefined');
                return;
            }

            const userData = await fetchUserDataById(userId);
            // console.log(userData)
            if (!userData || !userData.company) {
                console.error('User data or company data is undefined');
                return;
            }
            // console.log(userData.company._id.toString())
            await fetchCompanyDataById(userData.company._id.toString());
        };
        fetchData();
    }, [session]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files ? event.target.files[0] : null;
        if (uploadedFile) {
            setFile(uploadedFile);
            setPreview(URL.createObjectURL(uploadedFile)); // create a preview URL for the uploaded image
            setCompanyData((prevData) => ({
                ...prevData,
                logo: URL.createObjectURL(uploadedFile),
            }));
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCompanyData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Ngăn chặn việc load lại trang
        const logo = file ? await convertFileToBase64(file) : companyData.logo;
        await submitForm({ ...companyData, description: companyData.description, logo });
    };

    const submitForm = async (data: typeof companyData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/companies/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update company");
            }

            const result = await response.json();
            console.log("Company updated successfully:", result);
        } catch (error) {
            console.error("Error updating company:", error);
        }
    };

    return (
        <Box sx={{ padding: 4, maxWidth: '100%', margin: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Cập nhật Company
            </Typography>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    label="Tên công ty *"
                    fullWidth
                    margin="normal"
                    required
                    name="name"
                    value={companyData.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Địa chỉ *"
                    fullWidth
                    margin="normal"
                    required
                    name="address"
                    value={companyData.address}
                    onChange={handleChange}
                />
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Logo
                    </Typography>
                    <Input
                        type="file"
                        onChange={handleFileUpload}
                        inputProps={{ accept: "image/*" }}
                        style={{ display: 'block', marginBottom: '10px' }}
                    />
                    {(preview || companyData.logo) && (
                        <Card sx={{ maxWidth: 120 }}>
                            <CardMedia
                                component="img"
                                alt="Logo Preview"
                                image={preview || companyData.logo}
                            />
                        </Card>
                    )}
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Miêu tả
                    </Typography>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ReactQuill
                            value={companyData.description}
                            onChange={(value: string) => setCompanyData((prevData) => ({
                                ...prevData,
                                description: value,
                            }))}
                            placeholder="Nhập nội dung miêu tả..."
                            style={{ height: '100%', width: '100%' }}
                            ref={quillRef}
                            modules={modules}
                        />
                    </Suspense>

                </Box>
                <Grid container spacing={2} justifyContent="flex-end" sx={{
                    marginTop: 1
                }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Lưu
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default CompanyInfo;