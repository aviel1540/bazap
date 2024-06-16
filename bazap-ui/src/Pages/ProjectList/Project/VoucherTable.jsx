import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../../Components/Layout/Loader";
import CustomCard from "../../../Components/UI/CustomCard";
import EmptyData from "../../../Components/UI/EmptyData";
import { useProject } from "../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../Components/store/UserAlertContext";
import { deleteVoucher, exportVoucherToExcel, getAllVouchers } from "../../../Utils/voucherApi";
import { Table, Tag, Typography } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDropDown from "../../../Components/UI/CustomDropDown";
const { Text } = Typography;

import IosShareIcon from "@mui/icons-material/IosShare";
import { getAllUnits } from "../../../Utils/unitAPI";
const VoucherTable = () => {
    const { data: units, isLoading: isUnitsLoading } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const { projectId } = useProject();
    const { isLoading, data: vouchers } = useQuery({
        queryKey: ["vouchers", projectId],
        queryFn: getAllVouchers,
        enabled: projectId !== null,
    });
    const { onConfirm } = useUserAlert();
    const queryClient = useQueryClient();

    const onDeleteDeviceTypeHandler = (id) => {
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את השובר?",
            okHandler: () => {
                deleteDeviceMutation.mutate(id);
            },
        };
        onConfirm(config);
    };
    const menuActions = [
        {
            key: "exportVoucher",
            label: "יצא לשובר",
            icon: <IosShareIcon />,
            handler: (data) => {
                exportVoucherMutation.mutate(data._id);
            },
        },
        {
            key: "deleteVoucher",
            danger: true,
            label: "מחק",
            icon: <DeleteIcon />,
            handler: (data) => {
                onDeleteDeviceTypeHandler(data._id);
            },
        },
    ];
    const columns = () => [
        {
            title: "מספר שובר",
            dataIndex: "voucherNumber",
            key: "voucherNumber",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "יחידה",
            key: "voucherNumber",
            filters: !isUnitsLoading
                ? units.map((unit) => {
                      return { text: unit.unitsName, value: unit._id };
                  })
                : [],
            onFilter: (value, record) => record.unit._id == value,
            render: ({ unit }) => unit.unitsName,
        },
        {
            title: "סוג שובר",
            key: "type",
            render: ({ type }) => {
                const label = type ? "קבלה" : "ניפוק";
                const color = type ? "#ffc700" : "#50cd89";
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'נופק ע"י',
            dataIndex: "arrivedBy",
            key: "arrivedBy",
        },
        {
            title: 'התקבל ע"י',
            dataIndex: "receivedBy",
            key: "receivedBy",
        },
        {
            title: 'סה"כ מכשירים',
            render: ({ deviceList }) => deviceList.length,
            key: "deviceList",
        },
        {
            title: "פעולות",
            key: "menu",
            align: "center",
            render: (_, row) => <CustomDropDown key={row._id} actions={menuActions} data={row} />,
        },
    ];
    const deleteDeviceMutation = useMutation(deleteVoucher, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
        },
    });
    const exportVoucherMutation = useMutation(exportVoucherToExcel, {});

    if (isLoading || isUnitsLoading) {
        return <Loader />;
    }

    return (
        <CustomCard title="שוברים">
            <Table
                locale={{ emptyText: <EmptyData label="אין שוברים להצגה" /> }}
                dataSource={vouchers}
                columns={columns()}
                rowKey={(record) => record._id}
            />
        </CustomCard>
    );
};

export default VoucherTable;
