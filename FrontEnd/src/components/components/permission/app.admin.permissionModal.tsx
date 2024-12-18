import { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";

// Style for the modal container
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

interface PermissionModalProps {
    open: boolean;
    handleClose: () => void;
    fetchPermissions: () => void;
    currentPermission: IPermission | null; // Thêm prop này
}

const PermissionModal = ({ open, handleClose, fetchPermissions, currentPermission }: PermissionModalProps) => {
    const [formData, setFormData] = useState<IPermission>({
        name: "",
        apiPath: "",
        method: "",
        module: "",
        createdBy: "",
        isDeleted: false,
        deletedAt: null,
        createdAt: "",
        updatedAt: "",
    });

    const { data: session } = useSession();
    const access_token = session?.access_token;

    const methods = ["GET", "POST", "PATCH", "DELETE"];

    useEffect(() => {
        if (currentPermission) {
            setFormData(currentPermission);
        } else {
            setFormData({
                name: "",
                apiPath: "",
                method: "",
                module: "",
                createdBy: "",
                isDeleted: false,
                deletedAt: null,
                createdAt: "",
                updatedAt: "",
            });
        }
    }, [currentPermission]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            const urlEncodedData = new URLSearchParams();
            urlEncodedData.append("name", formData.name);

            // Ensure apiPath starts with a '/'
            const apiPath = (formData.apiPath || '').startsWith('/') ? formData.apiPath : `/${formData.apiPath}`;
            urlEncodedData.append("apiPath", apiPath || '');

            urlEncodedData.append("method", formData.method || '');
            urlEncodedData.append("module", formData.module || '');

            const response = await fetch(`http://localhost:8000/api/v1/permissions/${currentPermission ? formData._id : ''}`, {
                method: currentPermission ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${access_token}`,
                },
                body: urlEncodedData.toString(),
            });

            console.log(urlEncodedData.toString());

            if (!response.ok) {
                throw new Error(`Failed to ${currentPermission ? 'update' : 'create'} permission`);
            }

            const data = await response.json();
            handleClose();
            fetchPermissions(); // Gọi hàm fetchPermissions sau khi tạo mới hoặc cập nhật thành công
        } catch (error) {
            console.error(`Error ${currentPermission ? 'updating' : 'creating'} permission:`, error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" id="modal-title">{currentPermission ? "Cập nhật Permission" : "Tạo mới Permission"}</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box mt={2} display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    <TextField
                        label="Tên Permission"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        placeholder="Nhập name"
                    />
                    <TextField
                        label="API Path"
                        name="apiPath"
                        value={formData.apiPath}
                        onChange={handleChange}
                        fullWidth
                        required
                        placeholder="Nhập path"
                    />
                    <TextField
                        select
                        label="Method"
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
                        fullWidth
                        required
                        placeholder="Please select a method"
                    >
                        {methods.map((method) => (
                            <MenuItem key={method} value={method}>
                                {method}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Thuộc Module"
                        name="module"
                        value={formData.module}
                        onChange={handleChange}
                        fullWidth
                        required
                        placeholder="Please select a module"
                    />
                </Box>
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button onClick={handleClose} variant="outlined">Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">{currentPermission ? "Cập nhật" : "Tạo mới"}</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PermissionModal;
