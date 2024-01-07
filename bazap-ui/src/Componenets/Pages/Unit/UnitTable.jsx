import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import propTypes from "prop-types";
import CustomModal from "../../UI/CustomModal";
import { useState } from "react";
import UnitForm from "./UnitForm";
import { deleteUnit } from "../../../Utils/unitAPI";
import CustomTable from "../../UI/CustomTable/CustomTable";
import TableActions from "../../UI/CustomTable/TableActions";
const UnitTable = ({ units, isLoading }) => {
    const [show, setShow] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const queryClient = useQueryClient();
    const onEditUnitHandler = (rowId, handleClose) => {
        const unit = units.find((item) => (item._id == rowId));
        if (unit) {
            handleClose(rowId);
            setFormValues({ unitName: unit.unitsName, id: unit._id });
            showModal();
        }
    };
    const onDeleteUnitHandler = (rowId, handleClose) => {
        handleClose(rowId);
        swalFire({
            html: "האם אתה בטוח מעוניין למחוק את היחידה?",
            icon: "warning",
            onConfirmHandler: () => {
                deleteUnitMutation.mutate(rowId);
            },
            showCancelButton: true,
            confirmButtonText: "כן, מחק",
        });
    };
    const actions = [
        { title: "ערוך", handler: onEditUnitHandler },
        { title: "מחק", handler: onDeleteUnitHandler },
    ];
    const columns = [
        {
            name: "שם יחידה",
            sortable: true,
            selector: (row) => row.unitsName,
        },
        {
            name: "פעולות",
            center: true,
            cell: (row) => <TableActions rowId={row._id} actions={actions} />,
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
        title: "עריכת סוג מכשיר",
        showExitButton: true,
        showOkButton: false,
        okButtonHandler: hideModal,
        showCancelButton: false,
        cancelButtonHandler: hideModal,
    };
    return (
        <>
            <CustomTable columns={columns} data={units} />
            <CustomModal {...modalProperties}>
                <UnitForm onCancel={hideModal} formValues={formValues} isEdit={true} />
            </CustomModal>
        </>
    );
};

UnitTable.propTypes = {
    units: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default UnitTable;
