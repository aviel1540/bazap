import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import Loader from "../../Components/Layout/Loader";
import { Table, Typography } from "antd";
import CustomDropDown from "../../Components/UI/CustomDropDown";
const { Text } = Typography;
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteUnit, getAllUnits } from "../../Utils/unitAPI";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyData from "../../Components/UI/EmptyData";

const UnitTable = ({ onEdit }) => {
    const queryClient = useQueryClient();
    const { onConfirm } = useUserAlert();
    const { isLoading, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });

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
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "פעולות",
            key: "menu",
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
        return <Loader />;
    }

    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין יחידות להצגה" /> }}
            dataSource={units}
            columns={columns}
            rowKey={(record) => record._id}
        />
    );
};

UnitTable.propTypes = {
    onEdit: propTypes.func.isRequired,
};

export default UnitTable;
