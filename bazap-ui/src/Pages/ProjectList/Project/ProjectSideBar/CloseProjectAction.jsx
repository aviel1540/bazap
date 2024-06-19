import BorderColorIcon from "@mui/icons-material/BorderColor";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProject } from "../../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
import { closeProject } from "../../../../Utils/projectAPI";
import ConfirmWithPasswordPopconfirm from "../../../../Components/UI/ConfirmWithPasswordPopconfirm";

const CloseProjectAction = () => {
    const { projectId } = useProject();
    const { onConfirm, onAlert, success } = useUserAlert();
    const queryClient = useQueryClient();

    const closeProjectMutation = useMutation(closeProject, {
        onSuccess: () => {
            queryClient.invalidateQueries(["project", projectId]);
            queryClient.invalidateQueries(["projects"]);
            onAlert("הפרוייקט נסגר בהצלחה!", success, true);
        },
    });

    const closeProjectHandler = () => {
        const config = {
            title: "האם אתה בטוח לסגור את הפרוייקט?",
            okHandler: () => {
                closeProjectMutation.mutate(projectId);
            },
        };
        onConfirm(config);
    };

    return (
        <ListItem disablePadding>
            <ConfirmWithPasswordPopconfirm onConfirm={closeProjectHandler}>
                <ListItemButton>
                    <ListItemIcon>
                        <BorderColorIcon />
                    </ListItemIcon>
                    <ListItemText primary="סגור פרוייקט" />
                </ListItemButton>
            </ConfirmWithPasswordPopconfirm>
        </ListItem>
    );
};

export default CloseProjectAction;
