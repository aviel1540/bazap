import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { DeviceStatuses, getDeviceStatusKey } from "../../../../Utils/utils";
import { useState } from "react";
import LightButton from "../../../UI/LightButton";
import Divider from "@mui/material/Divider";

const currentStatusToNextStatusMap = {
    WAIT_TO_WORK: ["AT_WORK"],
    AT_WORK: ["FIXED", "DEFECTIVE"],
    FIXED: ["FIXED_RETURN"],
    DEFECTIVE: ["DEFECTIVE_RETURN"],
};

const StatusForm = ({ status, onCacnel }) => {
    const [newStatus, setNewStatus] = useState(null);
    const handleChange = (event) => {
        setNewStatus(event.target.value);
    };
    const handelSave = () => {
        const statusInHebrew = DeviceStatuses[newStatus];
        alert(statusInHebrew);
    };
    return (
        <>
            <Stack direction="row" p={3} justifyContent="center" alignItems="center">
                <TextField disabled id="outlined-disabled" label="סטטוס נוכחי" defaultValue={status} />
                <KeyboardDoubleArrowLeftIcon fontSize="large" color="success" />
                <FormControl fullWidth>
                    <InputLabel id="newStatus">סטטוס חדש</InputLabel>
                    <Select labelId="newStatus" id="newStatusSelect" value={newStatus} onChange={handleChange} label="סטטוס חדש">
                        {currentStatusToNextStatusMap[getDeviceStatusKey(status)].map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {DeviceStatuses[opt]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
            <Box>
                <Divider variant="fullWidth" sx={{ paddingTop: 2 }} />
                <Stack spacing={2} direction="row" marginTop={2}>
                    <Button size="small" onClick={handelSave} variant="contained">
                        שמור
                    </Button>
                    <LightButton
                        size="small"
                        btncolor="dark"
                        onClick={onCacnel}
                        variant="contained"
                        sx={{
                            marginX: {
                                xs: "10px",
                            },
                        }}
                    >
                        בטל
                    </LightButton>
                </Stack>
            </Box>
        </>
    );
};

export default StatusForm;
