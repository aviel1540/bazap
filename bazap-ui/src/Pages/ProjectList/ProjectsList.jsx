import { useQuery } from "@tanstack/react-query";
import { Row, Col, Collapse } from "antd";
import Loader from "../../Components/Layout/Loader";
import CustomCard from "../../Components/UI/CustomCard";
import EmptyData from "../../Components/UI/EmptyData";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import { getAllProjects } from "../../Utils/projectAPI";
import ProjectForm from "./ProjectForm";
import ProjectItem from "./ProjectItem";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import { PlusOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

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

    const notFinishedProjects = projects.filter((project) => !project.finished);
    const finishedProjects = projects.filter((project) => project.finished);

    const renderProjects = (projectsList) =>
        projectsList.length === 0 ? (
            <EmptyData label="אין פרוייקטים להצגה" />
        ) : (
            <Row gutter={[16, 16]}>
                {projectsList.map((project) => (
                    <Col key={project._id} xs={24} sm={12} md={8} lg={8}>
                        <ProjectItem project={project} />
                    </Col>
                ))}
            </Row>
        );

    return (
        <CustomCard
            title="פרוייקטים"
            className="bg-transparent shadow-none border-bottom-0"
            action={
                <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                    הוסף פרוייקט
                </CustomButton>
            }
        >
            <Collapse defaultActiveKey={["1"]}>
                <Panel header="פרוייקטים בתהליך" key="1">
                    {renderProjects(notFinishedProjects)}
                </Panel>
                <Panel header="פרוייקטים שהושלמו" key="2">
                    {renderProjects(finishedProjects)}
                </Panel>
            </Collapse>
        </CustomCard>
    );
};

export default ProjectsList;
