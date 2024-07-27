import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProject } from "../../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
import { openProject } from "../../../../Utils/projectAPI";
import ConfirmWithPasswordPopconfirm from "../../../../Components/UI/ConfirmWithPasswordPopconfirm";

const OpenProjectAction = () => {
    const { projectId } = useProject();
    const { onConfirm, onAlert, success } = useUserAlert();
    const queryClient = useQueryClient();

    const closeProjectMutation = useMutation(openProject, {
        onSuccess: () => {
            queryClient.invalidateQueries(["project", projectId]);
            queryClient.invalidateQueries(["projects"]);
            onAlert("הפרוייקט נפתח בהצלחה!", success, true);
        },
    });

    const closeProjectHandler = () => {
        const config = {
            title: "האם אתה בטוח רוצה לפתוח את הפרוייקט?",
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
                        <LockOpenRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="פתח פרוייקט" />
                </ListItemButton>
            </ConfirmWithPasswordPopconfirm>
        </ListItem>
    );
};

export default OpenProjectAction;
