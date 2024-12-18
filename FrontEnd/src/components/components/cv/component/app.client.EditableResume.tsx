import React, { useRef, useState } from "react";
import { Box, TextField, Button, Typography, Drawer, IconButton, Paper, List, ListItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Resume from "../app.client.cvEditor";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const EditableResume: React.FC = () => {
    const [personalInfo, setPersonalInfo] = useState({
        name: "Hoàng Võ Ngọc Nguyên",
        dob: "17/08/2003",
        email: "nh027471@gmail.com",
        phone: "+84 123456789",
        linkedin: "linkedin.com/in/your-profile",
        address: "Xuân Hòa, Xuân Lộc, Đồng Nai",
    });

    const [summary, setSummary] = useState(
        "Highly motivated software engineer with experience in full-stack development."
    );

    const [workExperience, setWorkExperience] = useState([
        {
            company: "ABC Tech",
            position: "Software Engineer",
            dateRange: "01/2022 - Present",
            description: "Developed and maintained web applications.",
        },
    ]);

    const [technicalSkills, setTechnicalSkills] = useState([
        "JavaScript",
        "ReactJS",
        "NodeJS",
    ]);

    const [softSkills, setSoftSkills] = useState([
        "Teamwork",
        "Problem Solving",
        "Communication",
    ]);

    const [certifications, setCertifications] = useState([
        "AWS Certified Developer",
        "PMP Certified",
    ]);

    const [languages, setLanguages] = useState([
        "English (Fluent)",
        "Vietnamese (Native)",
    ]);

    const [projects, setProjects] = useState([
        {
            name: "Portfolio Website",
            description: "Personal portfolio to showcase projects and skills.",
            link: "https://yourportfolio.com",
        },
    ]);

    const addWorkExperience = () => {
        setWorkExperience([
            ...workExperience,
            { company: "", position: "", dateRange: "", description: "" },
        ]);
    };

    type WorkExperienceField = 'company' | 'position' | 'dateRange' | 'description';

    const updateWorkExperience = (index: number, field: WorkExperienceField, value: string) => {
        const updatedExperience = [...workExperience];
        updatedExperience[index][field] = value;
        setWorkExperience(updatedExperience);
    };

    const removeWorkExperience = (index: number) => {
        setWorkExperience(workExperience.filter((_, i) => i !== index));
    };

    const addTechnicalSkill = () => setTechnicalSkills([...technicalSkills, ""]);
    const removeTechnicalSkill = (index: number) =>
        setTechnicalSkills(technicalSkills.filter((_, i) => i !== index));

    const addSoftSkill = () => setSoftSkills([...softSkills, ""]);
    const removeSoftSkill = (index: number) =>
        setSoftSkills(softSkills.filter((_, i) => i !== index));

    const addCertification = () =>
        setCertifications([...certifications, ""]);
    const removeCertification = (index: number) =>
        setCertifications(certifications.filter((_, i) => i !== index));

    const addLanguage = () => setLanguages([...languages, ""]);
    const removeLanguage = (index: number) =>
        setLanguages(languages.filter((_, i) => i !== index));

    const addProject = () =>
        setProjects([...projects, { name: "", description: "", link: "" }]);
    const removeProject = (index: number) =>
        setProjects(projects.filter((_, i) => i !== index));

    const [education, setEducation] = useState([
        {
            institution: "University of Technology",
            period: "2018 - 2022",
            details: "Bachelor of Science in Computer Science",
        },
    ]);

    const addEducation = () => setEducation([...education, { institution: "", period: "", details: "" }]);
    const removeEducation = (index: number) => setEducation(education.filter((_, i) => i !== index));

    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const ref = useRef<HTMLDivElement>(null);

    const generateResumePDF = async () => {
        const element = ref.current;
        if (element) {
            const canvas = await html2canvas(element, {
                scale: 2, // Tăng độ phân giải của canvas để có chất lượng tốt hơn
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [canvas.width, canvas.height], // Chuyển đổi kích thước canvas từ px sang mm
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Nếu chiều cao của hình ảnh lớn hơn chiều cao của trang A4, điều chỉnh lại kích thước
            if (imgHeight > pageHeight) {
                const scaleFactor = pageHeight / imgHeight;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * scaleFactor, pageHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            }

            pdf.save('resume.pdf');
        }
    };

    // const generateResumePDF = dynamic(() => import("./WinPrint"), {
    //     ssr: false,
    // });

    return (
        <Box sx={{}}>
            {/* Phần chỉnh sửa */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box sx={{ width: 300, padding: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                        Edit Your Resume
                    </Typography>

                    {/* Chỉnh sửa Personal Info */}
                    <Typography variant="h6" mb={1}>
                        Personal Info
                    </Typography>
                    <TextField
                        fullWidth
                        label="Full Name"
                        value={personalInfo.name}
                        onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, name: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Date of Birth"
                        value={personalInfo.dob}
                        onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, dob: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={personalInfo.email}
                        onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, email: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={personalInfo.phone}
                        onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, phone: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="LinkedIn"
                        value={personalInfo.linkedin}
                        onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, linkedin: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        value={personalInfo.address}
                        onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, address: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />

                    {/* Chỉnh sửa Summary */}
                    <Typography variant="h6" mt={2} mb={1}>
                        Summary
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Professional Summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    {/* Chỉnh sửa Work Experience */}
                    <Typography variant="h6" mt={2} mb={1}>
                        Work Experience
                    </Typography>
                    {workExperience.map((experience, index) => (
                        <Box key={index} sx={{ mb: 3, borderBottom: "1px solid #ddd", pb: 2 }}>
                            <TextField
                                fullWidth
                                label="Company"
                                value={experience.company}
                                onChange={(e) =>
                                    updateWorkExperience(index, "company", e.target.value)
                                }
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Position"
                                value={experience.position}
                                onChange={(e) =>
                                    updateWorkExperience(index, "position", e.target.value)
                                }
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Date Range"
                                value={experience.dateRange}
                                onChange={(e) =>
                                    updateWorkExperience(index, "dateRange", e.target.value)
                                }
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={experience.description}
                                onChange={(e) =>
                                    updateWorkExperience(index, "description", e.target.value)
                                }
                                sx={{ mt: 1 }}
                            />
                            <IconButton
                                onClick={() => removeWorkExperience(index)}
                                color="error"
                                sx={{ mt: 1 }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={addWorkExperience}
                    >
                        Add Experience
                    </Button>

                    {/* Chỉnh sửa Education */}
                    <Typography variant="h6" mt={2} mb={1}>
                        Education
                    </Typography>
                    {education.map((edu, index) => (
                        <Box key={index} sx={{ mb: 3, borderBottom: "1px solid #ddd", pb: 2 }}>
                            <TextField
                                fullWidth
                                label="Institution"
                                value={edu.institution}
                                onChange={(e) =>
                                    setEducation(education.map((item, i) => i === index ? { ...item, institution: e.target.value } : item))
                                }
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Period"
                                value={edu.period}
                                onChange={(e) =>
                                    setEducation(education.map((item, i) => i === index ? { ...item, period: e.target.value } : item))
                                }
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Details"
                                value={edu.details}
                                onChange={(e) =>
                                    setEducation(education.map((item, i) => i === index ? { ...item, details: e.target.value } : item))
                                }
                                sx={{ mb: 1 }}
                            />
                            <IconButton
                                onClick={() => removeEducation(index)}
                                color="error"
                                sx={{ mt: 1 }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={addEducation}
                    >
                        Add Education
                    </Button>

                    {/* Chỉnh sửa Technical Skills */}
                    <Typography variant="h6" mt={2} mb={1}>
                        Technical Skills
                    </Typography>
                    <List>
                        {technicalSkills.map((skill, index) => (
                            <ListItem key={index} sx={{ display: "flex" }}>
                                <TextField
                                    fullWidth
                                    value={skill}
                                    onChange={(e) => {
                                        const newSkills = [...technicalSkills];
                                        newSkills[index] = e.target.value;
                                        setTechnicalSkills(newSkills);
                                    }}
                                    sx={{ mb: 1 }}
                                />
                                <IconButton
                                    onClick={() => removeTechnicalSkill(index)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <Button startIcon={<AddCircleOutlineIcon />} onClick={addTechnicalSkill}>
                        Add Skill
                    </Button>

                    {/* Chỉnh sửa Soft Skills */}
                    <Typography variant="h6" mt={2} mb={1}>
                        Soft Skills
                    </Typography>
                    <List>
                        {softSkills.map((skill, index) => (
                            <ListItem key={index} sx={{ display: "flex" }}>
                                <TextField
                                    fullWidth
                                    value={skill}
                                    onChange={(e) => {
                                        const newSkills = [...softSkills];
                                        newSkills[index] = e.target.value;
                                        setSoftSkills(newSkills);
                                    }}
                                    sx={{ mb: 1 }}
                                />
                                <IconButton
                                    onClick={() => removeSoftSkill(index)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <Button startIcon={<AddCircleOutlineIcon />} onClick={addSoftSkill}>
                        Add Soft Skill
                    </Button>

                    {/* Chỉnh sửa Certifications */}
                    <Typography variant="h6" mt={2} mb={1}>
                        Certifications
                    </Typography>
                    <List>
                        {certifications.map((certification, index) => (
                            <ListItem key={index} sx={{ display: "flex" }}>
                                <TextField
                                    fullWidth
                                    value={certification}
                                    onChange={(e) => {
                                        const newCertifications = [...certifications];
                                        newCertifications[index] = e.target.value;
                                        setCertifications(newCertifications);
                                    }}
                                    sx={{ mb: 1 }}
                                />
                                <IconButton
                                    onClick={() => removeCertification(index)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={addCertification}
                    >
                        Add Certification
                    </Button>

                    {/* Chỉnh sửa Languages */}
                    <Typography variant="h6" mt={2} mb={1}>
                        Languages
                    </Typography>
                    <List>
                        {languages.map((language, index) => (
                            <ListItem key={index} sx={{ display: "flex" }}>
                                <TextField
                                    fullWidth
                                    value={language}
                                    onChange={(e) => {
                                        const newLanguages = [...languages];
                                        newLanguages[index] = e.target.value;
                                        setLanguages(newLanguages);
                                    }}
                                    sx={{ mb: 1 }}
                                />
                                <IconButton
                                    onClick={() => removeLanguage(index)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <Button startIcon={<AddCircleOutlineIcon />} onClick={addLanguage}>
                        Add Language
                    </Button>

                    {/* Chỉnh sửa Projects */}
                    <Typography variant="h6" mt={2} mb={1}>
                        Projects
                    </Typography>
                    {projects.map((project, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Project Name"
                                value={project.name}
                                onChange={(e) => {
                                    const newProjects = [...projects];
                                    newProjects[index].name = e.target.value;
                                    setProjects(newProjects);
                                }}
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={project.description}
                                onChange={(e) => {
                                    const newProjects = [...projects];
                                    newProjects[index].description = e.target.value;
                                    setProjects(newProjects);
                                }}
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth
                                label="Link"
                                value={project.link}
                                onChange={(e) => {
                                    const newProjects = [...projects];
                                    newProjects[index].link = e.target.value;
                                    setProjects(newProjects);
                                }}
                                sx={{ mb: 1 }}
                            />
                            <IconButton
                                onClick={() => removeProject(index)}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddCircleOutlineIcon />} onClick={addProject}>
                        Add Project
                    </Button>
                </Box>
                {/* Button to generate PDF */}
                <Box>
                    <Button onClick={generateResumePDF}>Download PDF</Button>
                </Box>
            </Drawer>

            {/* Phần Preview */}
            <Box sx={{ height: "100%", overflow: "auto" }}>
                {/* Nút Hamburger */}
                <IconButton onClick={toggleDrawer} sx={{ mb: 2 }}>
                    {drawerOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                <Paper ref={ref}>
                    {/* Preview Resume */}
                    <Resume
                        personalInfo={personalInfo}
                        summary={summary}
                        languages={languages}
                        education={education}
                        technicalSkills={technicalSkills}
                        softSkills={softSkills}
                        workExperience={workExperience}
                        certifications={certifications}
                        projects={projects}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default EditableResume;