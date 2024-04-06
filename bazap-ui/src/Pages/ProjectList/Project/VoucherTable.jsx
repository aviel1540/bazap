import { Chip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import Loader from "../../../Components/Layout/Loader";
import CustomCard from "../../../Components/UI/CustomCard";
import CustomTable from "../../../Components/UI/CustomTable/CustomTable";
import TableActions from "../../../Components/UI/CustomTable/TableActions";
import EmptyData from "../../../Components/UI/EmptyData";
import { useProject } from "../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../Components/store/UserAlertContext";
import { deleteVoucher } from "../../../Utils/voucherApi";

const VoucherTable = ({ vouchers, isLoading }) => {
    const { onConfirm } = useUserAlert();

    const { projectId } = useProject();
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
            name: "מספר שובר",
            sortable: true,
            selector: (row) => row.voucherNumber,
        },
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
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <CustomCard title="שוברים">
            {vouchers.length > 0 ? <CustomTable columns={columns} data={vouchers} /> : <EmptyData label="אין שוברים להצגה" />}
        </CustomCard>
    );
};

VoucherTable.propTypes = {
    vouchers: propTypes.array.isRequired,
    isLoading: propTypes.bool.isRequired,
};

export default VoucherTable;
