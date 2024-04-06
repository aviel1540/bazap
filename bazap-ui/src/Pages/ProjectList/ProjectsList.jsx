import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Layout/Loader";
import CustomCard from "../../Components/UI/CustomCard";
import EmptyData from "../../Components/UI/EmptyData";
import LightButton from "../../Components/UI/LightButton";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import { getAllProjects } from "../../Utils/projectAPI";
import ProjectForm from "./ProjectForm";
import ProjectItem from "./ProjectItem";

const ProjectsList = () => {
    const { onShow, onHide } = useCustomModal();
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    if (isLoading) {
        return <Loader />;
    }
    const showModal = () => {
        onShow({
            title: "פרוייקט חדש",
            name: "project",
            body: <ProjectForm onCancel={() => onHide("project")} />,
        });
    };
    return (
        <CustomCard
            title="פרוייקטים"
            action={
                <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                    הוסף פרוייקט
                </LightButton>
            }
        >
            <Grid container spacing={2}>
                {projects.length == 0 && <EmptyData label="אין פרוייקטים להצגה" />}
                {projects.map((project) => (
                    <ProjectItem key={project._id} projectData={project} />
                ))}
            </Grid>
        </CustomCard>
    );
};

export default ProjectsList;
