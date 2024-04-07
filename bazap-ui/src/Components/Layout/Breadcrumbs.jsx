import { Breadcrumb } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../Utils/projectAPI";
import Box from "@mui/material/Box";

const breadcrumbNameMap = {
    "/": "דף הבית",
    "/DeviceType": "סוגי מכשירים",
    "/Project": "רשימת פרוייקטים",
    "/Project/:id": "פרוייקט:",
    "/Unit": "יחידות",
    "/Technician": "טכנאים",
};
const Breadcrumbs = () => {
    const location = useLocation();
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    const fetchProjectNameById = async (id) => {
        const project = projects.find((project) => project._id === id);
        return project.projectName;
    };

    useEffect(() => {
        if (!isLoading) {
            const generateBreadcrumbItems = async () => {
                const pathSnippets = location.pathname.split("/").filter((i) => i);
                const extraBreadcrumbItems = [];

                for (let i = 0; i < pathSnippets.length; i++) {
                    const url = `/${pathSnippets.slice(0, i + 1).join("/")}`;
                    let breadcrumbName = breadcrumbNameMap[url] || pathSnippets[i];

                    // Special handling for dynamic paths like 'Project/:id'
                    if (url.startsWith("/Project/") && pathSnippets[i] !== "Project") {
                        breadcrumbName = await fetchProjectNameById(pathSnippets[i]);
                    }

                    extraBreadcrumbItems.push(
                        <Breadcrumb.Item key={url}>
                            <Link to={url}>{breadcrumbName}</Link>
                        </Breadcrumb.Item>,
                    );
                }

                setBreadcrumbItems([
                    <Breadcrumb.Item key="home">
                        <Link to="/">דף הבית</Link>
                    </Breadcrumb.Item>,
                    ...extraBreadcrumbItems,
                ]);
            };

            generateBreadcrumbItems();
        }
    }, [location, isLoading]);

    return (
        <>
            {!isLoading && (
                <Box sx={{ marginBottom: "1rem" }}>
                    <Breadcrumb>{breadcrumbItems}</Breadcrumb>
                </Box>
            )}
        </>
    );
};

export default Breadcrumbs;
