import AddIcon from "@mui/icons-material/Add";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useProject } from "../../../../Components/store/ProjectContext";
import ProjectForm from "../../ProjectForm";
import { getProjectData } from "../../../../Utils/projectAPI";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
const EditProjectAction = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const { projectId } = useProject();
    const { data: project } = useQuery({
        queryKey: ["project", projectId],
        queryFn: getProjectData,
        enabled: projectId !== null,
    });
    const handleClick = () => {
        const formDefaultValues = {
            id: projectId,
            projectName: project.projectName,
        };
        setEditData(formDefaultValues);
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
        setEditData(null);
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="ערוך פרוייקט" />
                </ListItemButton>
            </ListItem>
            <ProjectForm formValues={editData} open={open} onCancel={handleCancel} isEdit={!!editData} />
        </>
    );
};

export default EditProjectAction;
