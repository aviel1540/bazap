import { Box, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Layout, Tag } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router";
import Loader from "../../../Components/Layout/Loader";
import { getProjectData } from "../../../Utils/projectAPI";
import { dateTostring } from "../../../Utils/utils";
import { getAllVouchers } from "../../../Utils/voucherApi";
import { useProject } from "../../../Components/store/ProjectContext";
import ArrivedDevices from "./DevicesInProject/DevicesInProject";
import ProjectSideBar from "./ProjectSideBar";
import VoucherTable from "./VoucherTable";

const Project = () => {
    const { id } = useParams();
    const { projectId, setProjectId } = useProject();

    useEffect(() => {
        setProjectId(id);
        return () => {
            setProjectId(null);
        };
    }, [id, setProjectId]);

    const { isLoading: isProjectLoading, data: project } = useQuery({
        queryKey: ["project", projectId],
        queryFn: getProjectData,
        enabled: projectId !== null,
    });

    const { isLoading: isVouchersLoading, data: vouchers } = useQuery({
        queryKey: ["vouchers", projectId],
        queryFn: getAllVouchers,
        enabled: projectId !== null,
    });

    const isLoading = isProjectLoading || isVouchersLoading;

    if (isLoading) {
        return <Loader />;
    }

    const items = [
        {
            key: "1",
            label: "תאריך התחלה",
            children: dateTostring(project.startDate),
        },
        {
            key: "2",
            label: "תאריך סיום",
            children: project.endDate ? dateTostring(project.endDate) : "אין",
        },
        {
            key: "3",
            label: 'סה"כ שוברים',
            children: <Tag>{project.vouchersList.length}</Tag>,
        },
    ];

    return (
        <Layout>
            <ProjectSideBar isProjectIsClosed={project.finished} />
            <Box
                style={{
                    overflowY: "scroll",
                    height: "85vh",
                    padding: "0px 24px 24px",
                }}
            >
                <Stack spacing={2}>
                    <Card title={`פרוייקט: ${project.projectName}`} bordered={false}>
                        <Descriptions items={items} />
                    </Card>
                    <ArrivedDevices />
                    <VoucherTable vouchers={vouchers} isLoading={isLoading} />
                </Stack>
            </Box>
        </Layout>
    );
};

export default Project;
