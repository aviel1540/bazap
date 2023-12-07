import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, DropdownButton } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import { deleteDeviceType } from "../../../Utils/deviceTypeApi";
import propTypes from "prop-types";

const DeviceTypeTable = ({ deviceTypes, isLoading }) => {
    const queryClient = useQueryClient();
    const onDeleteDeviceTypeHandler = (id) => {
        swalFire({
            html: "האם אתה בטוח מעוניין למחוק את סוג המכשיר?",
            icon: "warning",
            onConfirmHandler: () => {
                deleteDeviceMutation.mutate(id);
            },
            showCancelButton: true,
            confirmButtonText: "כן, מחק",
        });
    };
    const columns = [
        {
            name: "שם מכשיר",
            sortable: true,
            cell: (row) => {
                const stringWithEntities = row.deviceName;
                const decodedDeviceName = stringWithEntities.replace(/&#39;/g, "'");
                return <div>{decodedDeviceName}</div>;
            },
        },
        {
            name: "פעולות",
            center: true,
            cell: (row) => (
                <DropdownButton
                    onSelect={(event) => {
                        selectActionHandler(row, event);
                    }}
                    size="sm"
                    className="btn-light-primary"
                    id="dropdown-item-button"
                    title="פעולות"
                >
                    <Dropdown.Item eventKey="delete" as="button" className="btn-light-danger">
                        מחק
                    </Dropdown.Item>
                </DropdownButton>
            ),
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
    const selectActionHandler = (data, event) => {
        if (event === "delete") {
            onDeleteDeviceTypeHandler(data._id);
        }
    };
    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <DataTable className="table" columns={columns} data={deviceTypes} />
        </>
    );
};

DeviceTypeTable.propTypes = {
    deviceTypes: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default DeviceTypeTable;
