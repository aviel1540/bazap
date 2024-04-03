import Sider from "antd/es/layout/Sider";
import { theme } from "antd";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IosShareIcon from "@mui/icons-material/IosShare";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useProject } from "../../../store/ProjectContext";
import { useMutation } from "@tanstack/react-query";
import { useUserAlert } from "../../../store/UserAlertContext";
import { dateTostring } from "../../../../Utils/utils";
import { createProjectReport } from "../../../../Utils/excelUtils";
import VoucherStepper from "./NewVoucher/VoucherStepper";
import { useCustomModal } from "../../../store/CustomModalContext";
import { getAllDevicesInProject, getAllDevicesInLab } from "../../../../Utils/deviceApi";

const ProjectSideBar = () => {
    const { projectId } = useProject();
    const { onAlert, warning } = useUserAlert();
    const { onShow, onHide } = useCustomModal();
    const {
        token: { colorBgContainer, borderRadius },
    } = theme.useToken();

    const getDevicesInLab = async () => {
        const devices = await getAllDevicesInLab({ queryKey: [null, projectId] });
        return devices;
    };
    const getAllDevicesInProjectAction = async () => {
        const devices = await getAllDevicesInProject({ queryKey: [null, projectId] });
        const filteredDevices = devices.filter((device) => device.voucherOut != null);
        return filteredDevices;
    };
    const getAllDevicesInProjectMutation = useMutation(getDevicesInLab, {
        onSuccess: (devices) => {
            if (devices.length == 0) {
                onAlert('אין מכשירים בבצ"פ בפרוייקט.');
            } else {
                createProjectReport(devices, "דוח_צ'_לתאריך_" + dateTostring(Date.now()));
            }
        },
        onError: ({ message }) => {
            onAlert(message, warning);
        },
    });
    const getAllDevicesOutMutation = useMutation(getAllDevicesInProjectAction, {
        onSuccess: (devices) => {
            if (devices.length == 0) {
                onAlert('אין מכשירים בבצ"פ בפרוייקט.');
            } else {
                createProjectReport(devices, "דוח_מכשירים_שנופקו" + dateTostring(Date.now()));
            }
        },
        onError: ({ message }) => {
            onAlert(message, warning);
        },
    });
    const createDeviceReport = () => {
        getAllDevicesInProjectMutation.mutate();
    };

    const createOutDevicesReport = () => {
        getAllDevicesOutMutation.mutate();
    };
    const modalProperties = {
        title: "שובר חדש",
        name: "voucherStepper",
        body: <VoucherStepper onCancel={() => onHide("voucherStepper")} />,
    };

    const addVoucher = () => {
        onShow(modalProperties);
    };
    const closeProject = () => {
        alert("סגור פרוייקט");
    };
    const actions = [
        { title: "הוסף שובר", icon: <AddIcon />, handler: addVoucher },
        { title: "הפק דוח צ'", icon: <IosShareIcon />, handler: createDeviceReport },
        { title: "סגור פרוייקט", icon: <BorderColorIcon />, handler: closeProject },
        { title: "דוח מכשירים שנופקו", icon: <ArrowOutwardIcon />, handler: createOutDevicesReport },
    ];
    return (
        <Sider
            style={{
                borderRadius: borderRadius,
                backgroundColor: colorBgContainer,
            }}
            width={200}
        >
            <List>
                {actions.map((action, index) => {
                    return (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={action.handler}>
                                <ListItemIcon>{action.icon}</ListItemIcon>
                                <ListItemText primary={action.title} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Sider>
    );
};

export default ProjectSideBar;
