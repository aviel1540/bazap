import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, DropdownButton } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import { deleteDeviceType } from "../../../Utils/deviceTypeApi";
import propTypes from "prop-types";
import CustomModal from "../../UI/CustomModal";
import { useState } from "react";
import DeviceForm from "./DeviceForm";

const DeviceTypeTable = ({ deviceTypes, isLoading }) => {
    const [show, setShow] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const queryClient = useQueryClient();
    const onEditDeviceTypeHandler = (data) => {
        setFormValues({ deviceTypeName: data.deviceName, id: data._id });
        showModal();
    };
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
            selector: (row) => row.deviceName,
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
        switch (event) {
            case "edit":
                onEditDeviceTypeHandler(data);
                break;
            case "delete":
                onDeleteDeviceTypeHandler(data._id);
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
                <DeviceForm onCancel={hideModal} formValues={formValues} isEdit={true} />
            </CustomModal>
        </>
    );
};

DeviceTypeTable.propTypes = {
    deviceTypes: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default DeviceTypeTable;
