// CreateDeviceReportAction.js
import IosShareIcon from "@mui/icons-material/IosShare";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useProject } from "../../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
import { createProjectReport } from "../../../../Utils/excelUtils";
import { dateTostring } from "../../../../Utils/utils";
import { getAllDevicesInLab } from "../../../../Utils/projectAPI";

const CreateDeviceReportAction = () => {
    const { projectId } = useProject();
    const { onAlert } = useUserAlert();
    const getAllDevicesInProjectMutation = useMutation(getAllDevicesInLab, {
        onSuccess: (devices) => {
            if (devices.length === 0) {
                onAlert('אין מכשירים בבצ"פ בפרוייקט.');
            } else {
                createProjectReport(devices, "דוח_צ'_לתאריך_" + dateTostring(Date.now()));
            }
        },
    });

    const createDeviceReport = () => {
        getAllDevicesInProjectMutation.mutate({ queryKey: [null, projectId] });
    };

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={createDeviceReport}>
                <ListItemIcon>
                    <IosShareIcon />
                </ListItemIcon>
                <ListItemText primary="הפק דוח צ'" />
            </ListItemButton>
        </ListItem>
    );
};

export default CreateDeviceReportAction;
