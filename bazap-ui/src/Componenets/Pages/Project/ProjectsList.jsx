import { getAllProjects } from "../../../Utils/projectAPI";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import ProjectItem from "./ProjectItem";
import { Row } from "react-bootstrap";

const ProjectsList = () => {
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    if (isLoading) {
        return <Loader />;
    }
    return (
        <Row sm={1} md={2} lg={3}>
            {projects.map((project) => (
                <ProjectItem key={project._id} projectData={project} />
            ))}
        </Row>
    );
};

export default ProjectsList;
