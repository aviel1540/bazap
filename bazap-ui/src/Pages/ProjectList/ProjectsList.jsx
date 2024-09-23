import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Row, Space } from "antd";
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
import SearchInput from "../../Components/UI/SearchInput";
import { dateTostring } from "../../Utils/utils";
import FilterMenu from "../../Components/UI/FilterMenu";

import "./projectList.css";

const ProjectsList = () => {
    const { onShow, onHide } = useCustomModal();
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        isTableView: true,
        projectType: "all",
        monthRange: [null, null],
    });

    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });

    // Save the table view state in localStorage
    useEffect(() => {
        localStorage.setItem("projectsView", JSON.stringify(filters.isTableView));
    }, [filters.isTableView]);

    // Update filters when any field in the FilterMenu changes
    const handleFilterChange = (updatedFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...updatedFilters, // Merge the updated filters into the state
        }));
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const clearAllFilters = () => {
        setFilters({
            isTableView: true,
            projectType: "all",
            monthRange: [null, null],
        });
        setSearchQuery("");
    };

    const showModal = () => {
        onShow({
            title: "פרוייקט חדש",
            name: "project",
            body: <ProjectForm onCancel={() => onHide("project")} />,
        });
    };

    // Apply filters to projects
    const filteredProjects = projects?.filter((project) => {
        // Filter by project type
        if (filters.projectType === "finished" && !project.finished) return false;
        if (filters.projectType === "notFinished" && project.finished) return false;

        // Filter by date range
        const { startDate, endDate, finished } = project;
        const projectStart = new Date(startDate);
        const projectEnd = finished ? new Date(endDate) : null;
        const [startFilterDate, endFilterDate] = filters.monthRange;

        if (startFilterDate && endFilterDate) {
            const filterStart = new Date(startFilterDate);
            const filterEnd = new Date(endFilterDate);

            if (finished) {
                if (projectStart < filterStart || projectEnd > filterEnd) return false;
            } else if (projectStart < filterStart || projectStart > filterEnd) return false;
        }

        return true;
    });

    const searchedProjects = filteredProjects?.filter((project) => {
        const { projectName, startDate, endDate } = project;
        const searchedProject = {
            projectName,
            startDate: dateTostring(startDate),
            endDate: dateTostring(endDate),
        };
        return JSON.stringify(searchedProject).toLowerCase().includes(searchQuery.toLowerCase());
    });

    const sortedProjects = searchedProjects?.sort((a, b) => {
        if (a.finished === b.finished) {
            return new Date(a.startDate) - new Date(b.startDate);
        }
        return a.finished ? 1 : -1;
    });

    if (isLoading) {
        return <Loader />;
    }

    // Configuration for the FilterMenu
    const filtersConfig = [
        {
            name: "isTableView",
            label: "מצב תצוגה",
            checkedChildren: "טבלה",
            unCheckedChildren: "כרטיסים",
            type: "switch",
            value: filters.isTableView,
            isView: true,
        },
        {
            name: "projectType",
            label: "מצב פרוייקט",
            type: "select",
            value: filters.projectType,
            options: [
                { value: "all", label: "הכל" },
                { value: "finished", label: "סגורים" },
                { value: "notFinished", label: "פתוחים" },
            ],
        },
        {
            name: "monthRange",
            label: "תאריכים",
            placeholder: ["תאריך התחלה", "תאריך סיום"],
            type: "monthRange",
            value: filters.monthRange,
        },
    ];

    return (
        <CustomCard
            title="פרוייקטים"
            action={
                <Space>
                    <SearchInput onSearch={handleSearchChange} value={searchQuery} />
                    <FilterMenu filtersConfig={filtersConfig} onFilterChange={handleFilterChange} clearAllFilters={clearAllFilters} />
                    <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף פרוייקט
                    </CustomButton>
                </Space>
            }
        >
            {filters.isTableView ? (
                <ProjectTable projects={sortedProjects} />
            ) : sortedProjects.length === 0 ? (
                <EmptyData label="אין פרוייקטים להצגה" />
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
