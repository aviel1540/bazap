import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../../Components/Layout/Loader";
import CustomCard from "../../../Components/UI/CustomCard";
import EmptyData from "../../../Components/UI/EmptyData";
import { useProject } from "../../../Components/store/ProjectContext";
import { useUserAlert } from "../../../Components/store/UserAlertContext";
import { deleteVoucher, exportVoucherToExcel, getAllVouchers, getVoucherById } from "../../../Utils/voucherApi";
import { Modal, Table, Tag, Typography } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
// import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CustomDropDown from "../../../Components/UI/CustomDropDown";
import IosShareIcon from "@mui/icons-material/IosShare";
import { dateTostring } from "../../../Utils/utils";
import { EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import DevicesInProjectTable from "./DevicesInProject/DevicesInProjectTable";
// import { useState } from "react";
// import ChangeProjectForm from "./ChangeProjectForm";
const { Text } = Typography;

const VoucherTable = () => {
    // const [open, setOpen] = useState(false);
    const [showDevicesModalOpen, setShowDevicesModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [voucherId, setVoucherId] = useState(null);
    // const [voucherData, setVoucherData] = useState({ voucherId: null, project: null });

    const { projectId } = useProject();

    const { isLoading, data: vouchers } = useQuery({
        queryKey: ["vouchers", projectId],
        queryFn: getAllVouchers,
        enabled: projectId !== null,
    });
    const { isLoading: isVoucherLoading } = useQuery({
        queryKey: ["voucher", voucherId],
        queryFn: getVoucherById,
        enabled: voucherId !== null,
        onSuccess: (voucher) => {
            setProducts([voucher.deviceList, voucher.accessoriesList]);
            setShowDevicesModalOpen(true);
        },
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
    const showDevicesModal = (id) => {
        const voucher = vouchers.find((voucher) => voucher._id == id);
        if (voucher) {
            setVoucherId(id);
        }
    };
    const menuActions = [
        {
            key: "showDevices",
            label: "צפה בשובר",
            icon: <EyeOutlined />,
            handler: (data) => {
                showDevicesModal(data._id);
            },
        },
        {
            key: "exportVoucher",
            label: "יצא לשובר",
            icon: <IosShareIcon />,
            handler: (data) => {
                exportVoucherMutation.mutate(data._id);
            },
        },
        // {
        //     key: "changeProject",
        //     label: "שנה פרוייקט",
        //     icon: <ChangeCircleIcon />,
        //     handler: (data) => {
        //         setVoucherData({ voucherId: data._id, project: data.project });
        //         setOpen(true);
        //     },
        // },
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
            onFilter: (value, record) => record.unit._id == value,
            render: ({ unit }) => unit.unitsName,
        },
        {
            title: "סוג שובר",
            key: "type",
            filters: [
                { text: "קבלה", value: true },
                { text: "ניפוק", value: false },
            ],
            onFilter: (value, record) => record.type == value,
            render: ({ type }) => {
                const label = type ? "קבלה" : "ניפוק";
                const color = type ? "warning" : "success";
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
            title: 'סה"כ מסווגים',
            render: ({ deviceList }) => deviceList.length,
            key: "deviceList",
        },
        {
            title: 'סה"כ צל"מ',
            render: ({ accessoriesList }) => accessoriesList.length,
            key: "deviceList",
        },
        {
            title: "תאריך",
            dataIndex: "date",
            key: "date",
            render: (date) => dateTostring(date),
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

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <CustomCard title="שוברים">
                <Table
                    locale={{ emptyText: <EmptyData label="אין שוברים להצגה" /> }}
                    dataSource={vouchers}
                    columns={columns()}
                    size="small"
                    rowKey={(record) => record._id}
                />
            </CustomCard>
            <Modal
                title="מכשירים בשובר"
                width="80%"
                cancelButtonProps={{ style: { display: "none" } }}
                open={showDevicesModalOpen}
                okText="סגור"
                onOk={() => setShowDevicesModalOpen(false)}
            >
                <DevicesInProjectTable
                    isActionsHidden={true}
                    filteredDevices={products}
                    rowSelection={undefined}
                    defaultPageSize={25}
                    handleStatusChange={null}
                    isLoading={isVoucherLoading}
                />
            </Modal>
            {/* <ChangeProjectForm open={open} onCancel={() => setOpen(false)} formValues={voucherData} /> */}
        </>
    );
};

export default VoucherTable;
