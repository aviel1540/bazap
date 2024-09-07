import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Row, Space, Switch, Select, DatePicker } from "antd";
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
import heIL from "antd/es/locale/he_IL"; // Importing Hebrew locale
import dayjs from "dayjs";

import "./projectList.css";
import FilterMenu from "../../Components/UI/FilterMenu";
const { Option } = Select;
const { RangePicker } = DatePicker;

const ProjectsList = () => {
    const { onShow, onHide } = useCustomModal();
    const [searchQuery, setSearchQuery] = useState("");
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });

    const [isTableView, setIsTableView] = useState(() => {
        const savedView = localStorage.getItem("projectsView");
        return savedView ? JSON.parse(savedView) : true; // Default to table view
    });

    const [filter, setFilter] = useState("all");
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        localStorage.setItem("projectsView", JSON.stringify(isTableView));
    }, [isTableView]);

    const handleToggleView = () => {
        setIsTableView((prevView) => !prevView);
    };

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const handleDateChange = (dates) => {
        if (dates) {
            setDateRange(dates);
        } else {
            setDateRange([null, null]);
        }
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const clearAllFilters = () => {
        setFilter("all");
        setDateRange([null, null]);
        setSearchQuery("");
    };

    const showModal = () => {
        onShow({
            title: "פרוייקט חדש",
            name: "project",
            body: <ProjectForm onCancel={() => onHide("project")} />,
        });
    };

    const filteredProjects =
        projects?.filter((project) => {
            if (filter === "finished") return project.finished;
            if (filter === "notFinished") return !project.finished;
            return true;
        }) || [];

    const dateFilteredProjects = filteredProjects.filter((project) => {
        const { startDate, endDate, finished } = project;
        if (!dateRange[0] || !dateRange[1]) {
            return true;
        }
        const projectStart = new Date(startDate);
        const projectEnd = finished ? new Date(endDate) : null;

        if (finished) {
            return projectStart >= dateRange[0] && projectEnd <= dateRange[1];
        } else {
            return projectStart >= dateRange[0] && projectStart <= dateRange[1];
        }
    });

    const searchedProjects = dateFilteredProjects.filter((project) => {
        const { projectName, startDate, endDate } = project;
        const searchedProject = { projectName, startDate: dateTostring(startDate), endDate: dateTostring(endDate) };
        return JSON.stringify(searchedProject).toLowerCase().includes(searchQuery.toLowerCase());
    });

    const sortedProjects = searchedProjects.sort((a, b) => {
        if (a.finished === b.finished) {
            return new Date(a.startDate) - new Date(b.startDate);
        }
        return a.finished ? 1 : -1;
    });

    const rangePresets = [
        {
            label: "3 חודשים אחרונים",
            value: [dayjs().subtract(3, "month"), dayjs()],
        },
        {
            label: "חצי שנה אחרונה",
            value: [dayjs().subtract(6, "month"), dayjs()],
        },
        {
            label: "שנה אחרונה",
            value: [dayjs().subtract(1, "year"), dayjs()],
        },
        {
            label: "שנתיים אחרונות",
            value: [dayjs().subtract(2, "year"), dayjs()],
        },
    ];

    const menuItems = [
        {
            label: <Switch checkedChildren="טבלה" unCheckedChildren="כרטיסים" checked={isTableView} onChange={handleToggleView} />,
            key: "view",
        },
        {
            label: (
                <Select
                    defaultValue="all"
                    value={filter}
                    onChange={handleFilterChange}
                    style={{ width: 120 }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing dropdown
                >
                    <Option value="all">הכל</Option>
                    <Option value="notFinished">פתוחים</Option>
                    <Option value="finished">סגורים</Option>
                </Select>
            ),
            key: "filter",
        },
        {
            label: (
                <RangePicker
                    value={dateRange}
                    presets={rangePresets}
                    format={"MM/YYYY"}
                    cellRender={(date) => {
                        return <div className="ant-picker-cell-inner">{formatDateToHebrew(date)}</div>;
                    }}
                    locale={heIL}
                    picker="month"
                    placeholder={["תאריך התחלה", "תאריך סיום"]}
                    onChange={handleDateChange}
                    onClick={(e) => e.stopPropagation()} // Prevent closing dropdown
                />
            ),
            key: "date",
        },
    ];

    if (isLoading) {
        return <Loader />;
    }

    const formatDateToHebrew = (date) => {
        return new Date(date).toLocaleDateString("he-IL", {
            month: "short",
        });
    };

    return (
        <CustomCard
            title="פרוייקטים"
            action={
                <Space>
                    <SearchInput onSearch={handleSearchChange} value={searchQuery} />
                    <FilterMenu clearAllFilters={clearAllFilters} menuItems={menuItems} />
                    <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף פרוייקט
                    </CustomButton>
                </Space>
            }
        >
            {isTableView ? (
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
