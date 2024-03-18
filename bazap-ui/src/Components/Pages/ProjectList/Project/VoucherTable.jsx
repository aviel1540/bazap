import Loader from "../../../Layout/Loader";
import propTypes from "prop-types";
import { Card, CardContent, CardHeader, Chip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVoucher } from "../../../../Utils/voucherApi";
import TableActions from "../../../UI/CustomTable/TableActions";
import CustomTable from "../../../UI/CustomTable/CustomTable";
import LightButton from "../../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import VoucherStepper from "./NewVoucher/VoucherStepper";
import { useCustomModal } from "../../../store/CustomModalContext";
import { useProject } from "../../../store/ProjectContext";
import { FloatButton } from "antd";
import EmptyData from "../../../UI/EmptyData";
import { useUserAlert } from "../../../store/UserAlertContext";

const VoucherTable = ({ vouchers, isLoading }) => {
    const { onAlert, onConfirm, error } = useUserAlert();

    const { projectId } = useProject();
    const { onShow, onHide } = useCustomModal();
    const queryClient = useQueryClient();
    const onDeleteDeviceTypeHandler = (id, handleClose) => {
        handleClose && handleClose(id);
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את השובר?",
            okHandler: () => {
                deleteDeviceMutation.mutate(id);
            },
        };
        onConfirm(config);
    };
    const actions = [
        {
            title: "מחק",
            handler: (rowId, handleClose) => {
                onDeleteDeviceTypeHandler(rowId, handleClose);
            },
        },
    ];
    const columns = [
        {
            name: "יחידה",
            sortable: true,
            selector: (row) => row.unit?.unitsName,
        },
        {
            name: "סוג שובר",
            sortable: true,
            selector: (row) => row.type,
            cell: (row) => {
                const label = row.type ? "קבלה" : "ניפוק";
                const color = row.type ? "warning" : "success";
                return <Chip label={label} color={color} />;
            },
        },
        {
            name: 'נופק ע"י',
            selector: (row) => row.arrivedBy,
        },
        {
            name: 'התקבל ע"י',
            selector: (row) => row.receivedBy,
        },
        {
            name: 'סה"כ מכשירים',
            selector: (row) => row.deviceList.length,
        },
        {
            name: "פעולות",
            center: true,
            cell: (row) => <TableActions rowId={row._id} actions={actions} />,
        },
    ];
    const deleteDeviceMutation = useMutation(deleteVoucher, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const modalProperties = {
        title: "שובר חדש",
        maxWidth: "md",
        body: <VoucherStepper onCancel={onHide} projectId={projectId} />,
    };
    const showModal = () => {
        onShow(modalProperties);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <Card>
                <CardHeader
                    titleTypographyProps={{ variant: "h6" }}
                    title="שוברים"
                    action={
                        <LightButton variant="contained" btncolor="primary" size="small" icon={<AddIcon />} onClick={showModal}>
                            הוסף שובר
                        </LightButton>
                    }
                />
                <CardContent>
                    {vouchers.length > 0 ? <CustomTable columns={columns} data={vouchers} /> : <EmptyData label="אין שוברים להצגה" />}
                </CardContent>
            </Card>
            <FloatButton onClick={showModal} />
        </>
    );
};

VoucherTable.propTypes = {
    vouchers: propTypes.array.isRequired,
    isLoading: propTypes.bool.isRequired,
};

export default VoucherTable;
