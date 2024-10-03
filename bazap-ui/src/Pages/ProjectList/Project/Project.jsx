import { Stack } from "@mui/material";
import { Badge, Card, Descriptions, Layout, Tag } from "antd";
import Loader from "../../../Components/Layout/Loader";
import { dateTostring } from "../../../Utils/utils";
import { useProject } from "../../../Components/store/ProjectContext";
import ArrivedDevices from "./DevicesInProject/DevicesInProject";
import ProjectSideBar from "./ProjectSideBar";
import VoucherTable from "./VoucherTable";
import { Content } from "antd/es/layout/layout";

const Project = () => {
    const { project, isLoading } = useProject();

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Layout>
            <ProjectSideBar
                isProjectIsClosed={project.finished}
                style={{
                    position: "fixed",
                    height: "100vh",
                    left: 0,
                    top: 0,
                    overflow: "auto",
                }}
            />
            <Layout>
                <Content
                    style={{
                        padding: "0px 16px 0px",
                    }}
                >
                    <Stack spacing={2}>
                        <Badge.Ribbon color={project.finished ? "red" : "green"} text={project.finished ? "פרוייקט סגור" : "פרוייקט פתוח"}>
                            <Card title={`פרוייקט: ${project.projectName}`} bordered={false}>
                                <Descriptions
                                    items={[
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
                                    ]}
                                />
                            </Card>
                        </Badge.Ribbon>
                        <ArrivedDevices />
                        <VoucherTable />
                    </Stack>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Project;
