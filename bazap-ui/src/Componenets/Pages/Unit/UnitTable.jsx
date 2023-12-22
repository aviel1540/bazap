import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import propTypes from "prop-types";
import CustomModal from "../../UI/CustomModal";
import { useState } from "react";
import UnitForm from "./UnitForm";
import { deleteUnit } from "../../../Utils/unitAPI";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const UnitTable = ({ deviceTypes, isLoading }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [show, setShow] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const queryClient = useQueryClient();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onEditUnitHandler = (data) => {
        handleClose();
        setFormValues({ unitName: data.unitsName, id: data._id });
        showModal();
    };
    const onDeleteUnitHandler = (id) => {
        handleClose();
        swalFire({
            html: "האם אתה בטוח מעוניין למחוק את היחידה?",
            icon: "warning",
            onConfirmHandler: () => {
                deleteUnitMutation.mutate(id);
            },
            showCancelButton: true,
            confirmButtonText: "כן, מחק",
        });
    };
    const columns = [
        {
            name: "שם יחידה",
            sortable: true,
            selector: (row) => row.unitsName,
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
                        <MenuItem onClick={() => onEditUnitHandler(row)}>ערוך</MenuItem>
                        <MenuItem onClick={() => onDeleteUnitHandler(row._id)}>מחק</MenuItem>
                    </Menu>
                </>
            ),
        },
    ];
    const deleteUnitMutation = useMutation(deleteUnit, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
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
    const showModal = () => {
        setShow(true);
    };
    const hideModal = () => {
        setShow(false);
    };
    const modalProperties = {
        show,
        handleClose: () => {},
        title: "סוג מוצר חדש",
        showExitButton: true,
        showOkButton: false,
        okButtonHandler: hideModal,
        showCancelButton: false,
        cancelButtonHandler: hideModal,
    };
    return (
        <>
            <DataTable className="table" columns={columns} data={deviceTypes} />
            <CustomModal {...modalProperties}>
                <UnitForm onCancel={hideModal} formValues={formValues} isEdit={true} />
            </CustomModal>
        </>
    );
};

UnitTable.propTypes = {
    deviceTypes: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default UnitTable;
