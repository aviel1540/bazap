import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, DropdownButton } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import propTypes from "prop-types";
import CustomModal from "../../UI/CustomModal";
import { useState } from "react";
import UnitForm from "./UnitForm";
import { deleteUnit } from "../../../Utils/unitAPI";

const UnitTable = ({ deviceTypes, isLoading }) => {
    const [show, setShow] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const queryClient = useQueryClient();
    const onEditUnitHandler = (data) => {
        setFormValues({ unitName: data.unitsName, id: data._id });
        showModal();
    };
    const onDeleteUnitHandler = (id) => {
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
                <DropdownButton
                    onSelect={(event) => {
                        selectActionHandler(row, event);
                    }}
                    size="sm"
                    className="btn-light-primary"
                    id="dropdown-item-button"
                    title="פעולות"
                >
                    <Dropdown.Item eventKey="edit" as="button">
                        ערוך
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="delete" as="button" className="btn-light-danger">
                        מחק
                    </Dropdown.Item>
                </DropdownButton>
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
    const selectActionHandler = (data, event) => {
        switch (event) {
            case "edit":
                onEditUnitHandler(data);
                break;
            case "delete":
                onDeleteUnitHandler(data._id);
                break;
            default:
                break;
        }
    };
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
