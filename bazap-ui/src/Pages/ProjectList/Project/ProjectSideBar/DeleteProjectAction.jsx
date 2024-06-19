import DeleteIcon from "@mui/icons-material/Delete";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";

import { deleteProject } from "../../../../Utils/projectAPI";
import ConfirmWithPasswordPopconfirm from "../../../../Components/UI/ConfirmWithPasswordPopconfirm";

const DeleteProjectAction = () => {
    const { projectId } = useProject();
    const { onConfirm } = useUserAlert();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const deleteProjectMutation = useMutation(deleteProject, {
        onSuccess: () => {
            queryClient.invalidateQueries(["projects"]);
            navigate("/project");
        },
    });

    const deleteProjectHandler = () => {
        const config = {
            title: "האם אתה בטוח למחוק את הפרוייקט?",
            okHandler: () => {
                deleteProjectMutation.mutate(projectId);
            },
        };
        onConfirm(config);
    };

    return (
        <ListItem disablePadding>
            <ConfirmWithPasswordPopconfirm onConfirm={deleteProjectHandler}>
                <ListItemButton>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="מחק פרוייקט" />
                </ListItemButton>
            </ConfirmWithPasswordPopconfirm>
        </ListItem>
    );
};

export default DeleteProjectAction;
