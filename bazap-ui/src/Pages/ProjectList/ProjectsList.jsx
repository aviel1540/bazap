import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Row, Space, Switch, Select } from "antd";
import Loader from "../../Components/Layout/Loader";
import CustomCard from "../../Components/UI/CustomCard";
import EmptyData from "../../Components/UI/EmptyData";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import { getAllProjects } from "../../Utils/projectAPI";
import ProjectForm from "./ProjectForm";
import ProjectItem from "./ProjectItem";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import ProjectTable from "./ProjectTable";

const { Option } = Select;

const ProjectsList = () => {
    const { onShow, onHide } = useCustomModal();
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });

    const [isTableView, setIsTableView] = useState(() => {
        const savedView = localStorage.getItem("projectsView");
        return savedView ? JSON.parse(savedView) : true; // Default to table view
    });

    const [filter, setFilter] = useState("all");

    useEffect(() => {
        localStorage.setItem("projectsView", JSON.stringify(isTableView));
    }, [isTableView]);

    const handleToggleView = () => {
        setIsTableView((prevView) => !prevView);
    };

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const showModal = () => {
        onShow({
            title: "פרוייקט חדש",
            name: "project",
            body: <ProjectForm onCancel={() => onHide("project")} />,
        });
    };

    const filteredProjects = projects.filter((project) => {
        if (filter === "finished") return project.finished;
        if (filter === "notFinished") return !project.finished;
        return true;
    });

    const sortedProjects = filteredProjects.sort((a, b) => {
        if (a.finished === b.finished) {
            return new Date(a.startDate) - new Date(b.startDate);
        }
        return a.finished ? 1 : -1;
    });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <CustomCard
            title="פרוייקטים"
            action={
                <Space>
                    <Switch checkedChildren="טבלה" unCheckedChildren="כרטיסים" checked={isTableView} onChange={handleToggleView} />
                    <Select defaultValue="all" onChange={handleFilterChange} style={{ width: 120 }}>
                        <Option value="all">הכל</Option>
                        <Option value="notFinished">פתוחים</Option>
                        <Option value="finished">סגורים</Option>
                    </Select>
                    <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף פרוייקט
                    </CustomButton>
                </Space>
            }
        >
            {sortedProjects.length === 0 ? (
                <EmptyData label="אין פרוייקטים להצגה" />
            ) : isTableView ? (
                <ProjectTable projects={sortedProjects} />
            ) : (
                <Row gutter={[16, 16]}>
                    {sortedProjects.map((project) => (
                        <ProjectItem key={project._id} project={project} />
                    ))}
                </Row>
            )}
        </CustomCard>
    );
};

export default ProjectsList;
