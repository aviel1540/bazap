import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import { deleteDeviceType } from "../../../Utils/deviceTypeApi";
import propTypes from "prop-types";
import TableActions from "../../UI/CustomTable/TableActions";
import CustomTable from "../../UI/CustomTable/CustomTable";
import { useAlert } from "../../store/AlertContext";
import { replaceApostrophe } from "../../../Utils/utils";
import { swalFire } from "../../UI/Swal";

const DeviceTypeTable = ({ deviceTypes, isLoading }) => {
    const { onAlert } = useAlert();
    const queryClient = useQueryClient();
    const onDeleteDeviceTypeHandler = (rowId, handleClose) => {
        handleClose(rowId);
        const options = {
            showCancel: true,
            icon: "warning",
            confirmButtonText: "כן, מחק",
            handleConfirm: () => {
                
            },
        };
        // const message = "";
        // onAlert({ message, options });
        swalFire({
            html: "האם אתה בטוח מעוניין למחוק את סוג המכשיר?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            onConfirmHandler: () => deleteDeviceMutation.mutate(rowId),
        });
    };
    const actions = [{ title: "מחק", handler: onDeleteDeviceTypeHandler }];
    const columns = [
        {
            name: "שם מכשיר",
            sortable: true,
            selector: (row) => row.deviceName,
            cell: (row) => {
                return <div>{replaceApostrophe(row.deviceName)}</div>;
            },
        },
        {
            name: "פעולות",
            center: true,
            cell: (row) => <TableActions rowId={row._id} actions={actions} />,
        },
    ];
    const deleteDeviceMutation = useMutation(deleteDeviceType, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deviceTypes"] });
        },
        onError: ({ message }) => {
            const options = { showCancel: false, icon: "error" };
            onAlert({ message, options });
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    return <CustomTable className="table" columns={columns} data={deviceTypes} />;
};

DeviceTypeTable.propTypes = {
    deviceTypes: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default DeviceTypeTable;
