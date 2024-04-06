import { useMutation, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { replaceApostrophe } from "../../Utils/utils";
import Loader from "../../Components/Layout/Loader";
import CustomTable from "../../Components/UI/CustomTable/CustomTable";
import TableActions from "../../Components/UI/CustomTable/TableActions";
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteDeviceType } from "../../Utils/deviceTypeApi";

const DeviceTypeTable = ({ deviceTypes, isLoading }) => {
    const { onConfirm } = useUserAlert();
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
