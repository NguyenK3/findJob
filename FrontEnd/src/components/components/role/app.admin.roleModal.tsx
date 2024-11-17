import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Switch,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSession } from "next-auth/react";

interface RoleModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (role: IRole) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ open, onClose, onSave }) => {
    const [roleName, setRoleName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [modules, setModules] = useState<string[]>([]);
    const { data: session } = useSession();
    const access_token = session?.access_token;

    useEffect(() => {
        fetchPermissions();
    }, [access_token]);

    const handlePermissionChange = (section: string, action: string) => {
        setPermissions((prev) => {
            const updatedPermissions = [...prev];
            const permissionIndex = updatedPermissions.findIndex(
                (perm) => perm.module === section && perm.method === action
            );
            if (permissionIndex > -1) {
                updatedPermissions.splice(permissionIndex, 1);
            } else {
                updatedPermissions.push({ module: section, method: action, name: `${section}-${action}` });
            }
            return updatedPermissions;
        });
    };

    const fetchPermissions = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/permissions/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setPermissions(data.data.result || []);
            const uniqueModules = Array.from(new Set(data.data.result.map((perm: IPermission) => perm.module)));
            setModules(uniqueModules as string[]);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    const createRole = async (newRole: IRole) => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(newRole),
            });
            if (!response.ok) {
                throw new Error("Failed to create role");
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Error creating role:", error);
            throw error;
        }
    };

    const handleSave = async () => {
        const newRole: IRole = {
            name: roleName,
            description,
            isActive,
            permissions,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        try {
            const createdRole = await createRole(newRole);
            onSave(createdRole);
            onClose();
        } catch (error) {
            console.error("Failed to save role:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Tạo mới Role</DialogTitle>
            <DialogContent dividers>
                {/* Role Name and Status */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <TextField
                        label="Tên Role"
                        variant="outlined"
                        required
                        fullWidth
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                                color="primary"
                            />
                        }
                        label="Trạng thái"
                    />
                </Box>

                {/* Description */}
                <TextField
                    label="Miêu tả"
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Permissions Section */}
                <Typography variant="h6" gutterBottom>Quyền hạn</Typography>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Các quyền hạn được phép cho vai trò này
                </Typography>

                {/* Roles Permissions */}
                {modules.map((section) => (
                    <Accordion key={section}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={permissions.some((perm) => perm.module === section)}
                                        onChange={() =>
                                            setPermissions((prev) => {
                                                const updatedPermissions = [...prev];
                                                const actions = permissions
                                                    .filter((perm) => perm.module === section)
                                                    .map((perm) => perm.method);
                                                actions.forEach((action) => {
                                                    const index = updatedPermissions.findIndex(
                                                        (perm) => perm.module === section && perm.method === action
                                                    );
                                                    if (index > -1) {
                                                        updatedPermissions.splice(index, 1);
                                                    } else {
                                                        updatedPermissions.push({ module: section, method: action, name: `${section}-${action}` });
                                                    }
                                                });
                                                return updatedPermissions;
                                            })
                                        }
                                    />
                                }
                                label={section.toUpperCase()}
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {permissions
                                    .filter((perm) => perm.module === section)
                                    .map((perm) => (
                                        <Grid item xs={6} key={perm.apiPath}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={permissions.some(
                                                            (p) => p.module === section && p.apiPath === perm.apiPath
                                                        )}
                                                        onChange={() => handlePermissionChange(section, perm.method || '')}
                                                    />
                                                }
                                                label={perm.apiPath}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleModal;