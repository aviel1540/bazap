import { getAllProjects } from "../../../Utils/projectAPI";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import ProjectItem from "./ProjectItem";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

const ProjectsList = () => {
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    if (isLoading) {
        return <Loader />;
    }
    return (
        <Grid container spacing={2}>
            {projects.map((project) => (
                <ProjectItem key={project._id} projectData={project} />
            ))}
        </Grid>
    );
};

export default ProjectsList;
