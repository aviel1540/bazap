import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, Tag, Typography } from "antd";
import CustomDropDown from "../../Components/UI/CustomDropDown";
const { Text } = Typography;
import EmptyData from "../../Components/UI/EmptyData";
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteDeviceType, getAllDeviceTypes } from "../../Utils/deviceTypeApi";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import propTypes from "prop-types";
import TableLoader from "../../Components/Loaders/TableLoader";

const DeviceTypeTable = ({ onEdit }) => {
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });

    const { onConfirm } = useUserAlert();
    const queryClient = useQueryClient();

    const deleteDeviceMutation = useMutation(deleteDeviceType, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deviceTypes"] });
        },
    });

    const onDeleteDeviceTypeHandler = (id) => {
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את סוג המכשיר?",
            okHandler: () => {
                deleteDeviceMutation.mutate(id);
            },
        };
        onConfirm(config);
    };

    const onEditUnitHandler = (id) => {
        const deviceType = deviceTypes.find((item) => item._id == id);
        if (deviceType) {
            onEdit(null, {
                deviceName: deviceType.deviceName,
                catalogNumber: deviceType.catalogNumber,
                isClassified: deviceType.isClassified ? "true" : "false",
                id: deviceType._id,
            });
        }
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
                onDeleteDeviceTypeHandler(data._id);
            },
        },
    ];

    const columns = [
        {
            title: "שם מכשיר",
            dataIndex: "deviceName",
            key: "deviceName",
            sorter: (a, b) => a.deviceName.localeCompare(b.deviceName),
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'מק"ט',
            dataIndex: "catalogNumber",
            key: "catalogNumber",
            sorter: (a, b) => a.catalogNumber.localeCompare(b.catalogNumber),
        },
        {
            title: "סוג שובר",
            dataIndex: "type",
            key: "type",
            filters: [
                { text: "מסווג", value: true },
                { text: 'צל"מ', value: false },
            ],
            onFilter: (value, record) => record.isClassified == value,
            render: (data) => {
                const label = data?.isClassified ? "מסווג" : 'צל"מ';
                const color = data?.isClassified ? "#50cd89" : "#ffc700";
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: "פעולות",
            align: "center",
            key: "menu",
            dataIndex: "actions",
            render: (_, row) => <CustomDropDown key={row._id} actions={menuActions} data={row} />,
        },
    ];

    if (isLoading) {
        return <TableLoader columns={columns} />;
    }

    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין סוגי מכשירים להצגה" /> }}
            dataSource={deviceTypes}
            columns={columns}
            rowKey={(record) => record._id}
        />
    );
};

DeviceTypeTable.propTypes = {
    onEdit: propTypes.func.isRequired,
};

export default DeviceTypeTable;
