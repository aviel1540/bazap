import { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useProject } from "../store/ProjectContext";

const breadcrumbNameMap = {
    "/": "דף הבית",
    "/DeviceType": "סוגי מכשירים",
    "/Project": "רשימת פרוייקטים",
    "/Unit": "יחידות",
    "/Technician": "טכנאים",
    "/Voucher": "שובר חדש",
    "/Dashboard": "נתוני פרוייקט",
};

const Breadcrumbs = () => {
    const location = useLocation();
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);
    const { projectId, project, isLoading } = useProject();

    useEffect(() => {
        if (!isLoading || projectId == null) {
            const generateBreadcrumbItems = async () => {
                const pathSnippets = location.pathname.split("/").filter((i) => i);
                const extraBreadcrumbItems = [];

                for (let i = 0; i < pathSnippets.length; i++) {
                    let url = `/${pathSnippets.slice(0, i + 1).join("/")}`;
                    if (Object.keys(breadcrumbNameMap).includes(`/${pathSnippets[i]}`) || url.startsWith("/Project/")) {
                        let breadcrumbName = breadcrumbNameMap[url] || breadcrumbNameMap[`/${pathSnippets[i]}`];

                        // Special handling for dynamic paths like 'Project/:id'
                        if (url.startsWith("/Project/") && i === 1) {
                            const projectId = pathSnippets[1];
                            breadcrumbName = "פרוייקט: " + project?.projectName;
                            url = `/Project/${projectId}`;
                        }
                        if (breadcrumbName) {
                            extraBreadcrumbItems.push({
                                path: url,
                                title: breadcrumbName,
                            });
                        }
                    }
                }

                setBreadcrumbItems(extraBreadcrumbItems);
            };

            generateBreadcrumbItems();
        }
    }, [location, isLoading]);

    return (
        <>
            {!isLoading && (
                <div className="fw-500 mb-4">
                    <Breadcrumb
                        separator="/"
                        itemRender={(route, params, routes) => {
                            const isLast = routes[routes.length - 1].path === route.path;
                            if (isLast) {
                                return <span>{route.title}</span>;
                            } else {
                                return <Link to={route.path}>{route.title}</Link>;
                            }
                        }}
                        items={[{ path: "/", title: "דף הבית" }, ...breadcrumbItems]}
                    />
                </div>
            )}
        </>
    );
};

export default Breadcrumbs;
