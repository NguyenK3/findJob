import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSession } from "next-auth/react";

interface RoleDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (newRole: IRole) => void;
    fetchRoles: (current: number, pageSize: number) => Promise<void>;
    current: number;
    pageSize: number;
    role?: IRole | null;
    isEditMode: boolean;
}

const RoleDialog: React.FC<RoleDialogProps> = ({ open, onClose, fetchRoles, current, pageSize, role: initialRole, isEditMode }) => {
    const [role, setRole] = useState<IRole>({
        name: "",
        description: "",
        isActive: true,
        permissions: [],
    });

    const [permission, setPermission] = useState<IPermission[]>([]);
    const [fillPermission, setFillPermission] = useState<string[]>([])
    const [groupedData, setGroupedData] = useState<{ [key: string]: IPermission[] }>({});
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [allSwitchesOn, setAllSwitchesOn] = useState<{ [key: string]: boolean }>({});
    const { data: session } = useSession();
    const access_token = session?.access_token;

    useEffect(() => {
        if (initialRole) {
            setRole(initialRole);
            const permissions = initialRole.permissions
                .map((perm: IPermission | string) => typeof perm === 'string' ? perm : perm._id)
                .filter((perm): perm is string => perm !== undefined);
            setSelectedPermissions(permissions);
        }
    }, [initialRole]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRole((prevRole) => ({ ...prevRole, [name]: value }));
    };

    const handleSwitchChange = (name: string) => {
        setRole((prevRole) => ({ ...prevRole, [name]: !(prevRole as any)[name] }));
    };

    const fetchPermissions = async (current: number, pageSize: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/permissions/?current=${current}&pageSize=${pageSize}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const data = await response.json();
            setPermission(data.data.result);
            setTotalCount(data.data.meta.total);
            return data.data;
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const resTotal = await fetchPermissions(1, 10);
            if (resTotal) {
                const res = await fetchPermissions(1, resTotal.meta.total);
                if (res) {
                    let data: string[] = [];
                    res.result.map((item: IPermission) => {
                        if (item.module) {
                            data.push(item.module);
                        }
                    });
                    data = Array.from(new Set(data));
                    setFillPermission(data);
                    if (data.length > 0) {
                        const groupedData = data.reduce((acc: { [key: string]: IPermission[] }, item) => {
                            if (!acc[item]) {
                                acc[item] = [];
                            }
                            const key = item;
                            res.result.map((itemModule: IPermission) => {
                                if (key === itemModule.module) {
                                    acc[key].push(itemModule);
                                }
                            });
                            return acc;
                        }, {});
                        setGroupedData(groupedData);
                    }
                }
            }
        };
        fetchData();
    }, []);

    const handleRolePermission = (permId: string, permName: string, permission: string) => {
        setSelectedPermissions((prevSelected) => {
            let updatedSelected;
            if (prevSelected.includes(permId)) {
                updatedSelected = prevSelected.filter((id) => id !== permId);
            } else {
                updatedSelected = [...prevSelected, permId];
            }

            const anyOn = groupedData[permission].some((perm) => perm._id && updatedSelected.includes(perm._id));
            setAllSwitchesOn((prev) => ({
                ...prev,
                [permission]: anyOn,
            }));

            return updatedSelected;
        });
    };

    useEffect(() => {
        const updatedSwitches = Object.keys(groupedData).reduce((acc, key) => {
            const anyOn = groupedData[key].some((perm) => perm._id && selectedPermissions.includes(perm._id));
            acc[key] = anyOn;
            return acc;
        }, {} as { [key: string]: boolean });
        setAllSwitchesOn(updatedSwitches);
    }, [groupedData, selectedPermissions]);

    const handleFetchRoleData = (permission: string) => {
        if (permission) {
            const allOn = !allSwitchesOn[permission];
            setAllSwitchesOn((prev) => ({
                ...prev,
                [permission]: allOn,
            }));

            setSelectedPermissions((prevSelected) => {
                let updatedSelected = [...prevSelected];
                groupedData[permission].forEach((perm) => {
                    if (perm._id) {
                        if (allOn && !updatedSelected.includes(perm._id)) {
                            updatedSelected.push(perm._id);
                        } else if (!allOn && updatedSelected.includes(perm._id)) {
                            updatedSelected = updatedSelected.filter((id) => id !== perm._id);
                        }
                    }
                });
                return updatedSelected;
            });
        }
    };

    const resetForm = () => {
        setRole({
            name: "",
            description: "",
            isActive: true,
            permissions: [],
        });
        setSelectedPermissions([]);
        setAllSwitchesOn({});
    };

    const handleSubmit = async () => {
        const newRole = {
            name: role.name,
            description: role.description,
            isActive: role.isActive,
            permissions: selectedPermissions,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/roles${isEditMode ? `/${role._id}` : ""}`, {
                method: isEditMode ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(newRole),
            });

            console.log('response', newRole);

            if (!response.ok) {
                throw new Error(`Failed to ${isEditMode ? "update" : "create"} role`);
            }

            const data = await response.json();
            onClose(); // Close the dialog after successful creation
            fetchRoles(current, pageSize); // Fetch lại data cho roleTable
            resetForm(); // Reset form after successful creation or update
            return data.data;

        } catch (error) {
            console.error(`Error ${isEditMode ? "updating" : "creating"} role:`, error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditMode ? "Cập nhật Role" : "Tạo mới Role"}</DialogTitle>
            <DialogContent dividers>
                {/* Role Name and Status */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <TextField
                        label="Tên Role"
                        variant="outlined"
                        required
                        fullWidth
                        name="name"
                        value={role.name}
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={role.isActive}
                                onChange={() => handleSwitchChange("isActive")}
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
                    name="description"
                    value={role.description}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />

                {/* Permissions Section */}
                <Typography variant="h6" gutterBottom>Quyền hạn</Typography>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Các quyền hạn được phép cho vai trò này
                </Typography>

                {/* Roles Permissions */}
                {fillPermission.map((permission, index) => (
                    <Accordion
                        key={index}
                        sx={{
                            margin: "8px 0",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.02)",
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: "#f5f5f5",
                                "&:hover": {
                                    backgroundColor: "#e0e0e0",
                                },
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={allSwitchesOn[permission] || false}
                                        onChange={() => handleFetchRoleData(permission)}
                                        sx={{
                                            "& .MuiSwitch-thumb": {
                                                color: "#4caf50",
                                            },
                                        }}
                                    />
                                }
                                label={<Typography fontWeight="bold">{permission}</Typography>}
                                sx={{ marginLeft: "8px" }}
                            />
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                backgroundColor: "#fafafa",
                                padding: "8px 16px",
                                borderTop: "1px solid #e0e0e0",
                            }}
                        >
                            {groupedData[permission]?.map((perm, idx) => (
                                <FormControlLabel
                                    key={idx}
                                    control={
                                        <Switch
                                            checked={perm._id ? selectedPermissions.includes(perm._id) : false}
                                            onChange={async () => {
                                                if (perm._id) {
                                                    handleRolePermission(perm._id, perm.name, permission);
                                                }
                                            }}
                                            sx={{
                                                "& .MuiSwitch-thumb": {
                                                    color: "#ff5722",
                                                },
                                            }}
                                        />
                                    }
                                    label={<Typography>{perm.name}</Typography>}
                                    sx={{ margin: "8px 0" }}
                                />
                            ))}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save
                </Button>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                {isEditMode &&
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
}

export default RoleDialog;