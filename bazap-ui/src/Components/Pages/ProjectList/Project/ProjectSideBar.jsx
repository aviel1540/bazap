import React from "react";
import Sider from "antd/es/layout/Sider";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IosShareIcon from "@mui/icons-material/IosShare";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useProject } from "../../../store/ProjectContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAlert } from "../../../store/UserAlertContext";
import { dateTostring } from "../../../../Utils/utils";
import { createProjectReport } from "../../../../Utils/excelUtils";
import VoucherStepper from "./NewVoucher/VoucherStepper";
import { useCustomModal } from "../../../store/CustomModalContext";
import { getAllDevicesInProject, getAllDevicesInLab } from "../../../../Utils/deviceApi";
import { closeProject } from "../../../../Utils/projectAPI";
import { theme } from "antd";

const getDevicesInLab = async (projectId) => {
    const devices = await getAllDevicesInLab({ queryKey: [null, projectId] });
    return devices;
};
const getAllDevicesInProjectAction = async (projectId) => {
    const devices = await getAllDevicesInProject({ queryKey: [null, projectId] });
    const filteredDevices = devices.filter((device) => device.voucherOut != null);
    return filteredDevices;
};

const ProjectSideBar = ({ isProjectIsClosed }) => {
    const {
        token: { colorBgContainer, borderRadius },
    } = theme.useToken();
    const { projectId } = useProject();
    const queryClient = useQueryClient();
    const { onAlert, warning, success } = useUserAlert();
    const { onShow, onHide } = useCustomModal();
    const getAllDevicesInProjectMutation = useMutation(getDevicesInLab, {
        onSuccess: (devices) => {
            if (devices.length == 0) {
                onAlert('אין מכשירים בבצ"פ בפרוייקט.');
            } else {
                createProjectReport(devices, "דוח_צ'_לתאריך_" + dateTostring(Date.now()));
            }
        },
    });
    const closeProjectMutation = useMutation(closeProject, {
        onSuccess: () => {
            queryClient.invalidateQueries(["project", projectId]);
            queryClient.invalidateQueries(["projects"]);
            onAlert("הפרוייקט נסגר בהצלחה!", success, true);
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
        getAllDevicesInProjectMutation.mutate(projectId);
    };

    const createOutDevicesReport = () => {
        getAllDevicesOutMutation.mutate(projectId);
    };

    const addVoucher = () => {
        onShow({
            title: "שובר חדש",
            name: "voucherStepper",
            body: <VoucherStepper onCancel={() => onHide("voucherStepper")} />,
        });
    };
    const closeProjectHandler = () => {
        closeProjectMutation.mutate(projectId);
    };
    const actions = [
        { title: "הוסף שובר", icon: <AddIcon />, handler: addVoucher, shouldAppearOnClosedProject: false },
        { title: "הפק דוח צ'", icon: <IosShareIcon />, handler: createDeviceReport, shouldAppearOnClosedProject: false },
        { title: "סגור פרוייקט", icon: <BorderColorIcon />, handler: closeProjectHandler, shouldAppearOnClosedProject: false },
        { title: "דוח מכשירים שנופקו", icon: <ArrowOutwardIcon />, handler: createOutDevicesReport, shouldAppearOnClosedProject: true },
    ];
    const filteredActions = actions.filter(
        (action) => action.shouldAppearOnClosedProject == isProjectIsClosed || action.shouldAppearOnClosedProject == true,
    );
    return (
        <Sider
            style={{
                borderRadius: borderRadius,
                backgroundColor: colorBgContainer,
            }}
            width={200}
        >
            <List>
                {filteredActions.map((action, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={action.handler}>
                            <ListItemIcon>{action.icon}</ListItemIcon>
                            <ListItemText primary={action.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Sider>
    );
};

export default ProjectSideBar;
