import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProjectData } from "../../../../Utils/projectAPI";
import Loader from "../../../Layout/Loader";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { getAllVouchers } from "../../../../Utils/voucherApi";
import VoucherTable from "./VoucherTable";
import CustomInfoLabel from "../../../UI/CustomForm/CustomInfoLabel";
import { dateTostring } from "../../../../Utils/utils";
import LightButton from "../../../UI/LightButton";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useProject } from "../../../store/ProjectContext";
import { useEffect } from "react";
import ArrivedDevices from "./ArrivedDevices/ArrivedDevices";
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
    return (
        <Stack spacing={2}>
            <Card>
                <CardHeader
                    titleTypographyProps={{ variant: "h6" }}
                    title={project.projectName}
                    action={
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
                />
                <CardContent>
                    <Grid container rowSpacing={1}>
                        <Grid xs={6}>
                            <Stack spacing={1}>
                                <CustomInfoLabel label="תאריך התחלה" value={dateTostring(project.startDate)} />
                                <CustomInfoLabel label="תאריך סיום" value={project.endDate ? dateTostring(project.endDate) : "אין"} />
                            </Stack>
                        </Grid>
                        <Grid xs={6}>
                            <Stack spacing={1}>
                                <CustomInfoLabel label='סה"כ שוברים' value={project.vouchersList.length} />
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <ArrivedDevices />
            <VoucherTable vouchers={vouchers} isLoading={isLoading} />
        </Stack>
    );
};

export default Project;
