import Sider from "antd/es/layout/Sider";
import { theme } from "antd";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IosShareIcon from "@mui/icons-material/IosShare";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useProject } from "../../../store/ProjectContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAlert } from "../../../store/UserAlertContext";
import { dateTostring } from "../../../../Utils/utils";
import { createVoucherReport } from "../../../../Utils/excelUtils";
import VoucherStepper from "./NewVoucher/VoucherStepper";
import { useCustomModal } from "../../../store/CustomModalContext";
// import VoucherStepper from "./Voucher/VoucherStepper/VoucherStepper";

const ProjectSideBar = () => {
    const { projectId } = useProject();
    const { onAlert, warning } = useUserAlert();
    const { onShow, onHide } = useCustomModal();
    const queryClient = useQueryClient();
    const {
        token: { colorBgContainer, borderRadius },
    } = theme.useToken();
    const getAllDevicesInProject = () => {
        return [];
    };
    const getAllDevicesInProjectMutation = useMutation(getAllDevicesInProject, {
        onSuccess: (devices) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            if (devices.length == 0) {
                onAlert('אין מכשירים בבצ"פ בפרוייקט.');
            } else {
                createVoucherReport(devices, "דוח_צ'_לתאריך_" + dateTostring(Date.now()));
            }
        },
        onError: ({ message }) => {
            onAlert(message, warning);
        },
    });
    const createDeviceReport = () => {
        getAllDevicesInProjectMutation.mutate(projectId);
    };
    const modalProperties = {
        title: "שובר חדש",
        maxWidth: "md",
        body: <VoucherStepper onCancel={onHide} projectId={projectId} />,
        // body: <VoucherStepper onCancel={onHide} projectId={projectId} />,
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
