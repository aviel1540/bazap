// CreateDeviceReportAction.js
import IosShareIcon from "@mui/icons-material/IosShare";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useProject } from "../../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
import { createExcel } from "../../../../Utils/excelUtils";
import { dateTostring, sortDevices } from "../../../../Utils/utils";
import { getAllDevicesInLab, getProjectData } from "../../../../Utils/projectAPI";

const CreateDeviceReportAction = () => {
    const { projectId } = useProject();
    const { data: project } = useQuery({
        queryKey: ["project", projectId],
        queryFn: getProjectData,
        enabled: projectId !== null,
    });
    const { onAlert } = useUserAlert();
    const getAllDevicesInProjectMutation = useMutation(getAllDevicesInLab, {
        onSuccess: (devices) => {
            if (devices.length === 0) {
                onAlert('אין מכשירים בבצ"פ בפרוייקט.');
            } else {
                const classifiedDevices = devices.filter((device) => device.deviceTypeId.isClassified);
                const nonClassifiedDevices = devices.filter((device) => !device.deviceTypeId.isClassified);

                const sortedClassifiedDevices = sortDevices(classifiedDevices);
                const sortedNonClassifiedDevices = sortDevices(nonClassifiedDevices);
                const deviceTitles = [["יחידה", "צ' מכשיר", "סוג מכשיר", "סטטוס "]];
                const excelData = [...deviceTitles];
                sortedClassifiedDevices.forEach((device) => {
                    excelData.push([device.unit.unitsName, device.serialNumber, device.deviceTypeId?.deviceName, device.status]);
                });
                excelData.push([]);
                const accessoriesTitle = [["יחידה", "יחידות", "סוג מכשיר", "סטטוס "]];
                excelData.push(...accessoriesTitle);
                sortedNonClassifiedDevices.forEach((device) => {
                    excelData.push([device.unit.unitsName, device.quantity, device.deviceTypeId?.deviceName, device.status]);
                });
                createExcel(excelData, `${project.projectName}_דוח_צ'_לתאריך_` + dateTostring(Date.now()));
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
