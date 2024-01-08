import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProjectData } from "../../../../Utils/projectAPI";
import Loader from "../../../Layout/Loader";
import CustomModal from "../../../UI/CustomModal";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import LightButton from "../../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { getAllVouchers } from "../../../../Utils/voucherApi";
import VoucherStepper from "./NewVoucher/VoucherStepper";
import VoucherTable from "./VoucherTable";

const Project = () => {
    const [show, setShow] = useState(false);
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
    const showModal = () => {
        setShow(true);
    };
    const hideModal = () => {
        setShow(false);
    };
    if (isLoading) {
        return <Loader />;
    }
    return (
        <>
            <Card>
                <CardHeader
                    titleTypographyProps={{ variant: "h6" }}
                    title={project.projectName}
                    action={
                        <LightButton variant="contained" btncolor="primary" size="small" icon={<AddIcon />} onClick={showModal}>
                            הוסף שובר
                        </LightButton>
                    }
                />
                <CardContent>
                    <Stack spacing={1}>
                        <VoucherTable vouchers={vouchers} isLoading={isLoading} projectId={id} />
                    </Stack>
                </CardContent>
            </Card>
            <CustomModal maxWidth="md" title="שובר חדש" show={show} showExitButton showCancelButton>
                <VoucherStepper onCancel={hideModal} projectId={id} />
            </CustomModal>
        </>
    );
};

export default Project;
