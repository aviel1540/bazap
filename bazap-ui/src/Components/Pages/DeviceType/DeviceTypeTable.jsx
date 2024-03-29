import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import { deleteDeviceType } from "../../../Utils/deviceTypeApi";
import propTypes from "prop-types";
import TableActions from "../../UI/CustomTable/TableActions";
import CustomTable from "../../UI/CustomTable/CustomTable";
import { replaceApostrophe } from "../../../Utils/utils";
import { useUserAlert } from "../../store/UserAlertContext";

const DeviceTypeTable = ({ deviceTypes, isLoading }) => {
    const { onAlert, onConfirm, error } = useUserAlert();
    const queryClient = useQueryClient();
    const onDeleteDeviceTypeHandler = (rowId, handleClose) => {
        handleClose(rowId);
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את סוג המכשיר?",
            okHandler: () => {
                deleteDeviceMutation.mutate(rowId);
            },
        };
        onConfirm(config);
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
            onAlert(message, error);
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
