import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Layout/Loader";
import propTypes from "prop-types";
import { deleteUnit, getAllUnits } from "../../../Utils/unitAPI";
import CustomTable from "../../UI/CustomTable/CustomTable";
import TableActions from "../../UI/CustomTable/TableActions";
import { useUserAlert } from "../../store/UserAlertContext";
const UnitTable = ({ onEdit }) => {
    const queryClient = useQueryClient();
    const { onAlert, onConfirm, error } = useUserAlert();
    const { isLoading, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });

    const onEditUnitHandler = (rowId, handleClose) => {
        const unit = units.find((item) => item._id == rowId);
        if (unit) {
            handleClose(rowId);
            onEdit(null, { unitName: unit.unitsName, id: unit._id });
        }
    };
    const onDeleteUnitHandler = (rowId, handleClose) => {
        handleClose(rowId);
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את היחידה?",
            okHandler: () => {
                deleteUnitMutation.mutate(rowId);
            },
        };
        onConfirm(config);
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
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    if (isLoading) {
        return <Loader />;
    }

    return <CustomTable columns={columns} data={units} />;
};

UnitTable.propTypes = {
    onEdit: propTypes.func.isRequired,
};

export default UnitTable;
