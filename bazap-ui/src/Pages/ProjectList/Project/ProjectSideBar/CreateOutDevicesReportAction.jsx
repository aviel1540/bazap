import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
import { createProjectReport } from "../../../../Utils/excelUtils";
import { dateTostring } from "../../../../Utils/utils";
import { getAllDevicesInProject } from "../../../../Utils/deviceApi";
import { useProject } from "../../../../Components/store/ProjectContext";

const getAllDevicesInProjectAction = async (projectId) => {
    const devices = await getAllDevicesInProject({ queryKey: [null, projectId] });
    const filteredDevices = devices.filter((device) => device.voucherOut != null);
    return filteredDevices;
};

const CreateOutDevicesReportAction = () => {
    const { projectId } = useProject();
    const { onAlert, warning } = useUserAlert();
    const getAllDevicesOutMutation = useMutation(getAllDevicesInProjectAction, {
        onSuccess: (devices) => {
            if (devices.length === 0) {
                onAlert('אין מכשירים בבצ"פ בפרוייקט.');
            } else {
                createProjectReport(devices, "דוח_מכשירים_שנופקו" + dateTostring(Date.now()));
            }
        },
        onError: ({ message }) => {
            onAlert(message, warning);
        },
    });

    const createOutDevicesReport = () => {
        getAllDevicesOutMutation.mutate(projectId);
    };

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={createOutDevicesReport}>
                <ListItemIcon>
                    <ArrowOutwardIcon />
                </ListItemIcon>
                <ListItemText primary="דוח מכשירים שנופקו" />
            </ListItemButton>
        </ListItem>
    );
};

export default CreateOutDevicesReportAction;
