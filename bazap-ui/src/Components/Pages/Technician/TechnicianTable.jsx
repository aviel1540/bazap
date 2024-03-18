import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import Loader from "../../Layout/Loader";
import propTypes from "prop-types";
import { useState } from "react";
import TechnicianForm from "./TechnicianForm";
import { deleteTechnician } from "../../../Utils/technicianAPI";
import { useCustomModal } from "../../store/CustomModalContext";
import TableActions from "../../UI/CustomTable/TableActions";
import { useUserAlert } from "../../store/UserAlertContext";

const TechnicianTable = ({ technicians, isLoading }) => {
    const { onAlert, error, onConfirm } = useUserAlert();

    const { onShow, onHide } = useCustomModal();
    const [formValues, setFormValues] = useState(null);
    const queryClient = useQueryClient();
    const onEditTechnicianHandler = (rowId, handleClose) => {
        const technician = technicians.find((item) => item._id == rowId);
        if (technician) {
            handleClose(rowId);
            setFormValues({ techName: technician.techName, id: technician._id });
            showModal();
        }
    };
    const onDeleteTechnicianHandler = (rowId, handleClose) => {
        handleClose(rowId);

        const config = {
            title: "האם אתה בטוח מעוניין למחוק את הטכנאי?",
            okHandler: () => {
                deleteTechnicianMutation.mutate(rowId);
            },
        };
        onConfirm(config);
    };
    const actions = [
        { title: "ערוך", handler: onEditTechnicianHandler },
        { title: "מחק", handler: onDeleteTechnicianHandler },
    ];
    const columns = [
        {
            name: "שם טכנאי",
            sortable: true,
            selector: (row) => row.techName,
        },
        {
            name: "פעולות",
            center: true,
            cell: (row) => <TableActions rowId={row._id} actions={actions} />,
        },
    ];
    const deleteTechnicianMutation = useMutation(deleteTechnician, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    if (isLoading) {
        return <Loader />;
    }
    const modalProperties = {
        title: "עריכת סוג מכשיר",
        maxWidth: "md",
        body: <TechnicianForm onCancel={onHide} formValues={formValues} isEdit={true} />,
    };
    const showModal = () => {
        onShow(modalProperties);
    };

    return <DataTable className="table" columns={columns} data={technicians} />;
};

TechnicianTable.propTypes = {
    technicians: propTypes.array,
    isLoading: propTypes.bool.isRequired,
};

export default TechnicianTable;
