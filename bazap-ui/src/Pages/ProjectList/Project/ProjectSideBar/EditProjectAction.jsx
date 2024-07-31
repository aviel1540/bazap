import AddIcon from "@mui/icons-material/Add";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useCustomModal } from "../../../../Components/store/CustomModalContext";
import { useProject } from "../../../../Components/store/ProjectContext";
import ProjectForm from "../../ProjectForm";
import { getProjectData } from "../../../../Utils/projectAPI";
import { useQuery } from "@tanstack/react-query";
const EditProjectAction = () => {
    const { onShow, onHide } = useCustomModal();
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
        onShow({
            title: "פרוייקט חדש",
            name: "project",
            body: <ProjectForm onCancel={() => onHide("project")} formValues={formDefaultValues} isEdit={true} />,
        });
    };

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="ערוך פרוייקט" />
            </ListItemButton>
        </ListItem>
    );
};

export default EditProjectAction;
