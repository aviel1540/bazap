import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
import { createExcel } from "../../../../Utils/excelUtils";
import { dateTostring, sortDevices } from "../../../../Utils/utils";
import { useProject } from "../../../../Components/store/ProjectContext";
import { getAllProductsInProject, getProjectData } from "../../../../Utils/projectAPI";

const getAllDevicesInProjectAction = async (projectId) => {
    const devices = await getAllProductsInProject({ queryKey: [null, projectId] });
    const filteredDevices = devices.filter((device) => device.voucherOut != null);
    return filteredDevices;
};

const CreateOutDevicesReportAction = () => {
    const { projectId } = useProject();
    const { data: project } = useQuery({
        queryKey: ["project", projectId],
        queryFn: getProjectData,
        enabled: projectId !== null,
    });
    const { onAlert, warning } = useUserAlert();
    const getAllDevicesOutMutation = useMutation(getAllDevicesInProjectAction, {
        onSuccess: (devices) => {
            if (devices.length === 0) {
                onAlert('אין מכשירים בבצ"פ בפרוייקט.');
            } else {
                const classifiedDevices = devices.filter((device) => device.deviceTypeId.isClassified);
                const nonClassifiedDevices = devices.filter((device) => !device.deviceTypeId.isClassified);

                // Sort both lists
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

                createExcel(excelData, `${project.projectName}_דוח_מכשירים_שנופקו` + dateTostring(Date.now()));
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
