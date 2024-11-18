import React, { use, useEffect, useState } from "react";
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
    IconButton,
    Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSession } from "next-auth/react";

interface RoleDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (newRole: IRole) => void;

}

const RoleDialog: React.FC<RoleDialogProps> = ({ open, onClose }) => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRole((prevRole) => ({ ...prevRole, [name]: value }));
    };

    const handleSwitchChange = (name: string) => {
        setRole((prevRole) => ({ ...prevRole, [name]: !(prevRole as any)[name] }));
    };

    const fetchPermissions = async (current: number, pageSize: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/permissions/?current=${current}&pageSize=${pageSize}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const data = await response.json();
            // console.log(data)
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
                    console.log("data", data);
                    setFillPermission(data);
                    if (data.length > 0) {
                        const groupedData = data.reduce((acc: { [key: string]: IPermission[] }, item) => {
                            // console.log("data", data);
                            if (!acc[item]) {
                                acc[item] = [];
                            }
                            const key = item;
                            // console.log("key", key);
                            res.result.map((itemModule: IPermission) => {
                                if (key === itemModule.module) {
                                    acc[key].push(itemModule);
                                }
                            });
                            // console.log("acc", acc);
                            return acc;
                        }, {});
                        setGroupedData(groupedData);
                        // console.log(groupedData);
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

            // Kiểm tra xem có ít nhất một switch trong AccordionDetails được bật hay không
            const anyOn = groupedData[permission].some((perm) => perm._id && updatedSelected.includes(perm._id));
            setAllSwitchesOn((prev) => ({
                ...prev,
                [permission]: anyOn,
            }));

            return updatedSelected;
        });
    };

    useEffect(() => {
        console.log("selectedPermissions", selectedPermissions);
    }, [selectedPermissions]);

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
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RoleDialog;
