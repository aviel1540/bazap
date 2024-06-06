import { Chip } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../../Components/Layout/Loader";
import CustomCard from "../../../Components/UI/CustomCard";
import CustomTable from "../../../Components/UI/CustomTable/CustomTable";
import TableActions from "../../../Components/UI/CustomTable/TableActions";
import EmptyData from "../../../Components/UI/EmptyData";
import { useProject } from "../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../Components/store/UserAlertContext";
import { deleteVoucher, exportVoucherToExcel, getAllVouchers } from "../../../Utils/voucherApi";

const VoucherTable = () => {
    const { projectId } = useProject();

    const { isLoading, data: vouchers } = useQuery({
        queryKey: ["vouchers", projectId],
        queryFn: getAllVouchers,
        enabled: projectId !== null,
    });

    const { onConfirm } = useUserAlert();

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
    const exportVoucherHandler = (id, handleClose) => {
        handleClose && handleClose(id);
        exportVoucherMutation.mutate(id);
    };
    const actions = [
        {
            title: "מחק",
            handler: (rowId, handleClose) => {
                onDeleteDeviceTypeHandler(rowId, handleClose);
            },
        },
        {
            title: "יצר שובר Excel",
            handler: (rowId, handleClose) => {
                exportVoucherHandler(rowId, handleClose);
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
    const exportVoucherMutation = useMutation(exportVoucherToExcel, {
        onSuccess: (data) => {
            console.log(data);
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

export default VoucherTable;
