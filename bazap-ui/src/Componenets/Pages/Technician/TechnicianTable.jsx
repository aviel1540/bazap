import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import propTypes from "prop-types";
import CustomModal from "../../UI/CustomModal";
import { useState } from "react";
import TechnicianForm from "./TechnicianForm";
import { deleteTechnician } from "../../../Utils/technicianAPI";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const TechnicianTable = ({ technicians, isLoading }) => {
    const [menuHandler, setMenuHandler] = useState(null);

    // const open = Boolean(anchorEl);

    const [show, setShow] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const queryClient = useQueryClient();
    const handleClick = (event, rowId) => {
        setMenuHandler((prevMenuHandler) => {
            const updatedMenuHandler = { ...prevMenuHandler };
            updatedMenuHandler[rowId] = event.currentTarget;
            return updatedMenuHandler;
        });
    };
    const handleClose = (rowId) => {
        setMenuHandler((prevMenuHandler) => {
            const updatedMenuHandler = { ...prevMenuHandler };
            updatedMenuHandler[rowId] = undefined;
            return updatedMenuHandler;
        });
    };
    const onEditTechnicianHandler = (data) => {
        handleClose();
        setFormValues({ techName: data.techName, id: data._id });
        showModal();
    };
    const onDeleteTechnicianHandler = (id) => {
        handleClose();
        swalFire({
            html: "האם אתה בטוח מעוניין למחוק את הטכנאי?",
            icon: "warning",
            onConfirmHandler: () => {
                deleteTechnicianMutation.mutate(id);
            },
            showCancelButton: true,
            confirmButtonText: "כן, מחק",
        });
    };
    const columns = [
        {
            name: "שם טכנאי",
            sortable: true,
            selector: (row) => row.techName,
        },
        {
            name: "פעולות",
            center: true,
            cell: (row) => (
                <>
                    <Button
                        variant="contained"
                        id="basic-button"
                        aria-controls={Boolean(menuHandler?.[row._id]) ?? false ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={Boolean(menuHandler?.[row._id]) ?? false ? "true" : undefined}
                        onClick={(event) => {
                            handleClick(event, row._id);
                        }}
                        size="small"
                        endIcon={<KeyboardArrowDownIcon />}
                    >
                        פעולות
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={menuHandler?.[row._id] ?? null}
                        open={Boolean(menuHandler?.[row._id]) ?? false}
                        onClose={() => handleClose(row._id)}
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
                        <MenuItem onClick={() => onEditTechnicianHandler(row)}>ערוך</MenuItem>
                        <MenuItem onClick={() => onDeleteTechnicianHandler(row._id)}>מחק</MenuItem>
                    </Menu>
                </>
            ),
        },
    ];
    const deleteTechnicianMutation = useMutation(deleteTechnician, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
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
        title: "עריכת סוג מכשיר",
        showExitButton: true,
        showOkButton: false,
        okButtonHandler: hideModal,
        showCancelButton: false,
        cancelButtonHandler: hideModal,
    };
    return (
        <>
            <DataTable className="table" columns={columns} data={technicians} />
            <CustomModal {...modalProperties}>
                <TechnicianForm onCancel={hideModal} formValues={formValues} isEdit={true} />
            </CustomModal>
        </>
    );
};

TechnicianTable.propTypes = {
    technicians: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default TechnicianTable;
