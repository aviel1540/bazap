import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import { deleteDeviceType } from "../../../Utils/deviceTypeApi";
import propTypes from "prop-types";
import TableActions from "../../UI/CustomTable/TableActions";
import CustomTable from "../../UI/CustomTable/CustomTable";

const DeviceTypeTable = ({ deviceTypes, isLoading }) => {
    const queryClient = useQueryClient();
    const onDeleteDeviceTypeHandler = (rowId, handleClose) => {
        handleClose(rowId);
        swalFire({
            html: "האם אתה בטוח מעוניין למחוק את סוג המכשיר?",
            icon: "warning",
            onConfirmHandler: () => {
                deleteDeviceMutation.mutate(rowId);
            },
            showCancelButton: true,
            confirmButtonText: "כן, מחק",
        });
    };
    const actions = [{ title: "מחק", handler: onDeleteDeviceTypeHandler }];
    const columns = [
        {
            name: "שם מכשיר",
            sortable: true,
            selector: (row) => row.deviceName,
            cell: (row) => {
                const stringWithEntities = row.deviceName;
                const decodedDeviceName = stringWithEntities.replace(/&#39;/g, "'");
                return <div>{decodedDeviceName}</div>;
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

    return <CustomTable className="table" columns={columns} data={deviceTypes} />;
};

DeviceTypeTable.propTypes = {
    deviceTypes: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default DeviceTypeTable;
