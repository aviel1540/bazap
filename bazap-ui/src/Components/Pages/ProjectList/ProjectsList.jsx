import { getAllProjects } from "../../../Utils/projectAPI";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import ProjectItem from "./ProjectItem";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import EmptyData from "../../UI/EmptyData";
import LightButton from "../../UI/LightButton";
import { Card, CardContent, CardHeader } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";
import ProjectForm from "./ProjectForm";

const ProjectsList = () => {
    const { onShow, onHide } = useCustomModal();
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    if (isLoading) {
        return <Loader />;
    }
    const modalProperties = {
        title: "פרוייקט חדש",
        maxWidth: "md",
        body: <ProjectForm onCancel={onHide} />,
    };
    const showModal = () => {
        onShow(modalProperties);
    };
    return (
        <Card>
            <CardHeader
                titleTypographyProps={{ variant: "h6" }}
                title="פרוייקטים"
                action={
                    <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                        הוסף פרוייקט
                    </LightButton>
                }
            />
            <CardContent>
                <Grid container spacing={2}>
                    {projects.length == 0 && <EmptyData label="אין פרוייקטים להצגה" />}
                    {projects.map((project) => (
                        <ProjectItem key={project._id} projectData={project} />
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ProjectsList;
