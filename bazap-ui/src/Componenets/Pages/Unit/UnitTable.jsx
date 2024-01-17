import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import { swalFire } from "../../UI/Swal";
import propTypes from "prop-types";
import { useState } from "react";
import UnitForm from "./UnitForm";
import { deleteUnit } from "../../../Utils/unitAPI";
import CustomTable from "../../UI/CustomTable/CustomTable";
import TableActions from "../../UI/CustomTable/TableActions";
import { useCustomModal } from "../../store/CustomModalContext";
const UnitTable = ({ units, isLoading }) => {
    const { onShow, onHide } = useCustomModal();
    const [formValues, setFormValues] = useState(null);
    const queryClient = useQueryClient();
    const onEditUnitHandler = (rowId, handleClose) => {
        const unit = units.find((item) => item._id == rowId);
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
    const modalProperties = {
        title: "עריכת סוג מכשיר",
        maxWidth: "md",
        body: <UnitForm onCancel={onHide} formValues={formValues} isEdit={true} />,
    };
    const showModal = () => {
        onShow(modalProperties);
    };

    return <CustomTable columns={columns} data={units} />;
};

UnitTable.propTypes = {
    units: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default UnitTable;
