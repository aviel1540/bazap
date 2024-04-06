import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import DataTable from "react-data-table-component";
import Loader from "../../Components/Layout/Loader";
import TableActions from "../../Components/UI/CustomTable/TableActions";
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteTechnician, getAllTechnicians } from "../../Utils/technicianAPI";

const TechnicianTable = ({ onEdit }) => {
    const queryClient = useQueryClient();
    const { onConfirm } = useUserAlert();
    const { isLoading, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    const onEditTechnicianHandler = (rowId, handleClose) => {
        const technician = technicians.find((item) => item._id == rowId);
        if (technician) {
            handleClose(rowId);
            onEdit(null, { techName: technician.techName, id: technician._id });
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
    });
    if (isLoading) {
        return <Loader />;
    }
    return <DataTable className="table" columns={columns} data={technicians} />;
};

TechnicianTable.propTypes = {
    onEdit: propTypes.func.isRequired,
};

export default TechnicianTable;
