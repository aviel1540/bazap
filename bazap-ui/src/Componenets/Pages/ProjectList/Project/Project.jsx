import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProjectData } from "../../../../Utils/projectAPI";
import Loader from "../../../Layout/Loader";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { getAllVouchers } from "../../../../Utils/voucherApi";
import VoucherTable from "./VoucherTable";
import ArrivedDevices from "./ArrivedDevices";

const Project = () => {
    const { id } = useParams();
    const { isLoading: isProjecLoading, data: project } = useQuery({
        queryKey: ["project", id],
        queryFn: getProjectData,
    });
    const { isLoading: isVouchersLoading, data: vouchers } = useQuery({
        queryKey: ["vouchers", id],
        queryFn: getAllVouchers,
    });
    const isLoading = isProjecLoading || isVouchersLoading;

    if (isLoading) {
        return <Loader />;
    }
    return (
        <>
            <Stack spacing={2}>
                <Card>
                    <CardHeader titleTypographyProps={{ variant: "h6" }} title={project.projectName} />
                    <CardContent>
                        <div>data...</div>
                        <div>data...</div>
                    </CardContent>
                </Card>

                <VoucherTable vouchers={vouchers} isLoading={isLoading} projectId={id} />
                <ArrivedDevices projectId={id} />
            </Stack>
        </>
    );
};

export default Project;
