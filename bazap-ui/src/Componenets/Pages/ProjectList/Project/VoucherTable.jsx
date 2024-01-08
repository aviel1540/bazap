import Loader from "../../../Layout/Loader";
import propTypes from "prop-types";
import { Chip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { swalFire } from "../../../UI/Swal";
import { deleteVoucher } from "../../../../Utils/voucherApi";
import TableActions from "../../../UI/CustomTable/TableActions";
import CustomTable from "../../../UI/CustomTable/CustomTable";

const VoucherTable = ({ vouchers, isLoading, projectId }) => {
    const queryClient = useQueryClient();
    const onDeleteDeviceTypeHandler = (id, handleClose) => {
        handleClose && handleClose(id);
        swalFire({
            html: "האם אתה בטוח מעוניין למחוק את השובר?",
            icon: "warning",
            onConfirmHandler: () => {
                deleteDeviceMutation.mutate(id);
            },
            showCancelButton: true,
            confirmButtonText: "כן, מחק",
        });
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
        onError: (message) => {
            swalFire({
                html: message,
                icon: "error",
                showCancelButton: false,
            });
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    return <CustomTable columns={columns} data={vouchers} />;
};

VoucherTable.propTypes = {
    vouchers: propTypes.array.isRequired,
    isLoading: propTypes.bool.isRequired,
    projectId: propTypes.string.isRequired,
};

export default VoucherTable;
