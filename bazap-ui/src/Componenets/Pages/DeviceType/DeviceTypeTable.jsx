import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import { deleteDeviceType } from "../../../Utils/deviceTypeApi";
import propTypes from "prop-types";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DeviceTypeTable = ({ deviceTypes, isLoading }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const queryClient = useQueryClient();
    const onDeleteDeviceTypeHandler = (id) => {
        handleClose();
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
            cell: (row) => (
                <>
                    <Button
                        variant="contained"
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        size="small"
                        endIcon={<KeyboardArrowDownIcon />}
                    >
                        פעולות
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        <MenuItem onClick={() => onDeleteDeviceTypeHandler(row._id)}>מחק</MenuItem>
                    </Menu>
                </>
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

    if (isLoading) {
        return <Loader />;
    }

    return <DataTable className="table" columns={columns} data={deviceTypes} />;
};

DeviceTypeTable.propTypes = {
    deviceTypes: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default DeviceTypeTable;
