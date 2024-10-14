import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { Table, Typography } from "antd";
import CustomDropDown from "../../Components/UI/CustomDropDown";
const { Text } = Typography;
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteDivision, getAllDivisions } from "../../Utils/divisionAPI";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyData from "../../Components/UI/EmptyData";
import TableLoader from "../../Components/Loaders/TableLoader";

const DivisionTable = ({ onEdit, searchQuery }) => {
    const queryClient = useQueryClient();
    const { onConfirm } = useUserAlert();
    const { isLoading, data: divisions } = useQuery({
        queryKey: ["divisions"],
        queryFn: getAllDivisions,
    });

    const filteredDivisions = divisions?.filter((division) => division.division_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const onEditDivisionHandler = (id) => {
        const division = divisions.find((item) => item._id == id);
        if (division) {
            onEdit(null, { division_name: division.division_name, id: division._id });
        }
    };

    const onDeleteDivisionHandler = (id) => {
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את האוגדה?",
            okHandler: () => {
                deleteDivisionMutation.mutate(id);
            },
        };
        onConfirm(config);
    };

    const menuActions = [
        {
            key: "1",
            label: "ערוך",
            icon: <BorderColorIcon />,
            handler: (data) => {
                onEditDivisionHandler(data._id);
            },
        },
        {
            key: "2",
            label: "מחק",
            isPasswordRequired: true,
            danger: true,
            icon: <DeleteIcon />,
            handler: (data) => {
                onDeleteDivisionHandler(data._id);
            },
        },
    ];

    const columns = [
        {
            title: "שם אוגדה",
            dataIndex: "division_name",
            key: "division_name",
            sorter: (a, b) => a.division_name.localeCompare(b.division_name),
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "פעולות",
            key: "menu",
            dataIndex: "actions",
            align: "center",
            render: (_, row) => <CustomDropDown key={row._id} actions={menuActions} data={row} />,
        },
    ];

    const deleteDivisionMutation = useMutation(deleteDivision, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["divisions"] });
        },
    });

    if (isLoading) {
        return <TableLoader columns={columns} />;
    }

    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין אוגדות להצגה" /> }}
            dataSource={filteredDivisions}
            size="small"
            columns={columns}
            rowKey={(record) => record._id}
        />
    );
};

DivisionTable.propTypes = {
    onEdit: propTypes.func.isRequired,
    searchQuery: propTypes.string,
};

export default DivisionTable;