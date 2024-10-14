import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { Table, Typography } from "antd";
import CustomDropDown from "../../Components/UI/CustomDropDown";
const { Text } = Typography;
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteBrigade, getAllBrigades } from "../../Utils/brigadeAPI";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyData from "../../Components/UI/EmptyData";
import TableLoader from "../../Components/Loaders/TableLoader";

const BrigadeTable = ({ onEdit, searchQuery }) => {
    const queryClient = useQueryClient();
    const { onConfirm } = useUserAlert();
    const { isLoading, data: brigades } = useQuery({
        queryKey: ["brigades"],
        queryFn: getAllBrigades,
    });

    const filteredBrigades = brigades?.filter((brigade) => brigade.brigadeName.toLowerCase().includes(searchQuery.toLowerCase()));

    const onEditBrigadeHandler = (id) => {
        const brigade = brigades.find((item) => item._id == id);
        if (brigade) {
            onEdit(null, { brigadeName: brigade.brigadeName, id: brigade._id });
        }
    };

    const onDeleteBrigadeHandler = (id) => {
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את החטיבה?",
            okHandler: () => {
                deleteBrigadeMutation.mutate(id);
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
                onEditBrigadeHandler(data._id);
            },
        },
        {
            key: "2",
            label: "מחק",
            isPasswordRequired: true,
            danger: true,
            icon: <DeleteIcon />,
            handler: (data) => {
                onDeleteBrigadeHandler(data._id);
            },
        },
    ];

    const columns = [
        {
            title: "שם חטיבה",
            dataIndex: "brigadeName",
            key: "brigadeName",
            sorter: (a, b) => a.brigadeName.localeCompare(b.brigadeName),
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "אוגדה",
            dataIndex: "division",
            key: "division",
            sorter: (a, b) => a.division?.division_name.localeCompare(b.division?.division_name),
            render: (_, row) => <Text>{row?.division?.division_name}</Text>,
        },
        {
            title: "פעולות",
            key: "menu",
            dataIndex: "actions",
            align: "center",
            render: (_, row) => <CustomDropDown key={row._id} actions={menuActions} data={row} />,
        },
    ];

    const deleteBrigadeMutation = useMutation(deleteBrigade, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brigades"] });
        },
    });

    if (isLoading) {
        return <TableLoader columns={columns} />;
    }

    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין חטיבות להצגה" /> }}
            dataSource={filteredBrigades}
            size="small"
            columns={columns}
            rowKey={(record) => record._id}
        />
    );
};

BrigadeTable.propTypes = {
    onEdit: propTypes.func.isRequired,
    searchQuery: propTypes.string,
};

export default BrigadeTable;
