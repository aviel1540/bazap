import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Layout/Loader";
import CustomCard from "../../Components/UI/CustomCard";
import EmptyData from "../../Components/UI/EmptyData";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import { getAllProjects } from "../../Utils/projectAPI";
import ProjectForm from "./ProjectForm";
import ProjectItem from "./ProjectItem";
import CustomButton from "../../Components/UI/CustomButton";
import { PlusOutlined } from "@ant-design/icons";

const ProjectsList = () => {
    const { onShow, onHide } = useCustomModal();
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });

    if (isLoading) {
        return <Loader />;
    }

    const sortedProjects = projects.sort((a, b) => {
        if (a.finished === b.finished) {
            return new Date(a.startDate) - new Date(b.startDate);
        }
        return a.finished ? 1 : -1;
    });

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
                <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                    הוסף פרוייקט
                </CustomButton>
            }
        >
            <Grid container spacing={2}>
                {sortedProjects.length === 0 && <EmptyData label="אין פרוייקטים להצגה" />}
                {sortedProjects.map((project) => (
                    <ProjectItem key={project._id} project={project} />
                ))}
            </Grid>
        </CustomCard>
    );
};

export default ProjectsList;
