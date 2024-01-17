import Loader from "../../../Layout/Loader";
import propTypes from "prop-types";
import { Card, CardContent, CardHeader, Chip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVoucher } from "../../../../Utils/voucherApi";
import TableActions from "../../../UI/CustomTable/TableActions";
import CustomTable from "../../../UI/CustomTable/CustomTable";
import { useAlert } from "../../../store/AlertContext";
import LightButton from "../../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import VoucherStepper from "./NewVoucher/VoucherStepper";
import { useCustomModal } from "../../../store/CustomModalContext";
const VoucherTable = ({ vouchers, isLoading, projectId }) => {
    const { onShow, onHide } = useCustomModal();
    const { onAlert } = useAlert();
    const queryClient = useQueryClient();
    const onDeleteDeviceTypeHandler = (id, handleClose) => {
        handleClose && handleClose(id);
        const options = {
            showCancel: true,
            icon: "warning",
            confirmButtonText: "כן, מחק",
            handleConfirm: () => {
                deleteDeviceMutation.mutate(id);
            },
        };
        const message = "האם אתה בטוח מעוניין למחוק את השובר?";
        const alertRecord = { message, options };
        onAlert(alertRecord);
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
            const options = { showCancel: false, icon: "error" };
            const error = { message, options };
            onAlert(error);
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
                    <CustomTable columns={columns} data={vouchers} />
                </CardContent>
            </Card>
        </>
    );
};

VoucherTable.propTypes = {
    vouchers: propTypes.array.isRequired,
    isLoading: propTypes.bool.isRequired,
    projectId: propTypes.string.isRequired,
};

export default VoucherTable;
