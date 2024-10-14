import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { Table, Typography } from "antd";
import CustomDropDown from "../../Components/UI/CustomDropDown";
const { Text } = Typography;
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteUnit, getAllUnits } from "../../Utils/unitAPI";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyData from "../../Components/UI/EmptyData";
import TableLoader from "../../Components/Loaders/TableLoader";

const UnitTable = ({ onEdit, searchQuery }) => {
    const queryClient = useQueryClient();
    const { onConfirm } = useUserAlert();
    const { isLoading, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });

    const filteredUnits = units?.filter((unit) => unit.unitsName.toLowerCase().includes(searchQuery.toLowerCase()));

    const onEditUnitHandler = (id) => {
        const unit = units.find((item) => item._id == id);
        if (unit) {
            onEdit(null, { unitName: unit.unitsName, id: unit._id });
        }
    };
    const onDeleteUnitHandler = (id) => {
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את היחידה?",
            okHandler: () => {
                deleteUnitMutation.mutate(id);
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
                onEditUnitHandler(data._id);
            },
        },
        {
            key: "2",
            label: "מחק",
            isPasswordRequired: true,
            danger: true,
            icon: <DeleteIcon />,
            handler: (data) => {
                onDeleteUnitHandler(data._id);
            },
        },
    ];
    const columns = [
        {
            title: "שם יחידה",
            dataIndex: "unitsName",
            key: "unitsName",
            sorter: (a, b) => a.unitsName.localeCompare(b.unitsName),
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "חטיבה",
            dataIndex: "brigade",
            key: "brigade",
            sorter: (a, b) => a.brigade?.brigadeName.localeCompare(b.brigade?.brigadeName),
            render: (_, row) => <Text>{row?.brigade?.brigadeName}</Text>,
        },
        {
            title: "אוגדה",
            dataIndex: "division",
            key: "division",
            sorter: (a, b) => a.brigade?.division?.division_name.localeCompare(b.brigade?.division?.division_name),
            render: (_, row) => <Text>{row.brigade?.division?.division_name}</Text>,
        },
        {
            title: "פעולות",
            key: "menu",
            dataIndex: "actions",
            align: "center",
            render: (_, row) => <CustomDropDown key={row._id} actions={menuActions} data={row} />,
        },
    ];
    const deleteUnitMutation = useMutation(deleteUnit, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
        },
    });

    if (isLoading) {
        return <TableLoader columns={columns} />;
    }

    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין יחידות להצגה" /> }}
            dataSource={filteredUnits}
            size="small"
            columns={columns}
            rowKey={(record) => record._id}
        />
    );
};

UnitTable.propTypes = {
    onEdit: propTypes.func.isRequired,
    searchQuery: propTypes.string,
};

export default UnitTable;
