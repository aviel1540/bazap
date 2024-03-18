import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProjectData } from "../../../../Utils/projectAPI";
import Loader from "../../../Layout/Loader";
import { Stack } from "@mui/material";
import { getAllVouchers } from "../../../../Utils/voucherApi";
import VoucherTable from "./VoucherTable";
import { dateTostring } from "../../../../Utils/utils";
import LightButton from "../../../UI/LightButton";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useProject } from "../../../store/ProjectContext";
import { useEffect } from "react";
import ArrivedDevices from "./ArrivedDevices/ArrivedDevices";
import { Card, Descriptions, Tag } from "antd";
const Project = () => {
    const { id } = useParams();

    const { projectId, setProjectId } = useProject();

    useEffect(() => {
        setProjectId(id);
        return () => {
            setProjectId(null);
        };
    }, [id, setProjectId]);

    const { isLoading: isProjecLoading, data: project } = useQuery({
        queryKey: ["project", projectId],
        queryFn: getProjectData,
        enabled: projectId !== null,
    });
    const { isLoading: isVouchersLoading, data: vouchers } = useQuery({
        queryKey: ["vouchers", projectId],
        queryFn: getAllVouchers,
        enabled: projectId !== null,
    });
    const isLoading = isProjecLoading || isVouchersLoading;
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
        <Stack spacing={2}>
            <Card
                title={`פרוייקט: ${project.projectName}`}
                bordered={false}
                extra={
                    <LightButton
                        variant="contained"
                        btncolor="dark"
                        icon={<SaveAltIcon />}
                        onClick={() => {
                            alert("סגור פרוייקט");
                        }}
                        size="small"
                    >
                        סגור פרויקט
                    </LightButton>
                }
            >
                <Descriptions items={items} />
            </Card>
            <ArrivedDevices />
            <VoucherTable vouchers={vouchers} isLoading={isLoading} />
        </Stack>
    );
};

export default Project;
