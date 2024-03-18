import { useQuery } from "@tanstack/react-query";
import { getAllArrivedDevicesInProject } from "../../../../../Utils/deviceApi";
import Loader from "../../../../Layout/Loader";
import {
    ALL,
    DeviceStatuses,
    FIXED_OR_DEFFECTIVE,
    RETURNED,
    addKeysToArray,
    replaceApostrophe,
    tagColors,
} from "../../../../../Utils/utils";
import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../../../UI/LightButton";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import StatusForm from "../StatusForm";
import { useCustomModal } from "../../../../store/CustomModalContext";
import SearchInput from "../../../../UI/SearchInput";
import { useProject } from "../../../../store/ProjectContext";
import { useRenderCount } from "@uidotdev/usehooks";
import StatusFilter from "./StatusFilter";
import VoucherStepper from "../NewVoucher/VoucherStepper";
import { Space, Table, Tag } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDropDown from "../../../../UI/CustomDropDown";
import EmptyData from "../../../../UI/EmptyData";

const menuActions = [
    {
        key: "1",
        danger: true,
        label: "מחק",
        icon: <DeleteIcon />,
        handler: (data) => {
            alert(data);
        },
    },
];
const ReturnedStatuses = [DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN];

const ArrivedDevices = () => {
    const renderCount = useRenderCount();
    const { projectId } = useProject();
    const { onShow, onHide } = useCustomModal();
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [searchParam, setSearchParam] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(ALL);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const { isLoading, data: devices } = useQuery({
        queryKey: ["arrivedDevices", projectId],
        queryFn: getAllArrivedDevicesInProject,
        onSuccess: (data) => {
            setFilteredDevices(data);
            if (devices) handleSearchAndFilter(searchParam, data, selectedStatus);
        },
    });

    useEffect(() => {
        if (devices) {
            clearSelectedRows();
            setSelectedStatus(ALL);
            handleSearchAndFilter(searchParam, null, ALL);
        }
    }, [devices]);

    const clearSelectedRows = () => {
        setSelectedRowKeys([]);
    };

    const handleSearchChange = (event) => {
        const search = event.target.value;
        setSearchParam(search);
        handleSearchAndFilter(search, null, selectedStatus);
    };
    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        handleSearchAndFilter(searchParam, null, status);
        clearSelectedRows();
    };
    const handleSearchAndFilter = (search, overrideDevices, status) => {
        const devicesToFilter = overrideDevices || devices;
        let newFilteredDevices = devicesToFilter.filter((device) => {
            if (status == ALL) return true;
            if (status == RETURNED) {
                return ReturnedStatuses.includes(device.status);
            }
            if (status == FIXED_OR_DEFFECTIVE) {
                return device.status == DeviceStatuses.FIXED || device.status == DeviceStatuses.DEFECTIVE;
            }
            return device.status == status;
        });
        if (newFilteredDevices.length == 0) {
            setSelectedStatus(ALL);
            newFilteredDevices = devicesToFilter;
        }

        const keysToInclude = ["serialNumber", "status", "deviceType"];

        newFilteredDevices = newFilteredDevices.filter((device) => {
            const searchObject = {
                ...keysToInclude.reduce((obj, key) => {
                    obj[key] = replaceApostrophe(device[key]);
                    return obj;
                }, {}),
                unitsName: device.unit?.unitsName,
            };

            const searchableString = JSON.stringify(searchObject).toLocaleLowerCase();
            return searchableString.includes(search.toLocaleLowerCase());
        });

        setFilteredDevices(newFilteredDevices);
    };

    const checkIfStatusExists = (status) => {
        const devicesStatusesGroup = Object.groupBy(devices, ({ status }) => status);
        if (status == RETURNED) {
            return (
                Object.keys(devicesStatusesGroup).includes(DeviceStatuses.DEFECTIVE_RETURN) ||
                Object.keys(devicesStatusesGroup).includes(DeviceStatuses.FIXED_RETURN)
            );
        }
        if (status == FIXED_OR_DEFFECTIVE) {
            return (
                Object.keys(devicesStatusesGroup).includes(DeviceStatuses.DEFECTIVE) ||
                Object.keys(devicesStatusesGroup).includes(DeviceStatuses.FIXED)
            );
        }
        return Object.keys(devicesStatusesGroup).includes(status);
    };

    const showModalChangeStatus = () => {
        const device = filteredDevices.find((dev) => dev._id === selectedRowKeys[0]);
        const devices = filteredDevices.filter((device) => selectedRowKeys.includes(device._id));
        const modalPropertiesChangeStatus = {
            title: "שינוי סטטוס",
            maxWidth: "md",
            body: (
                <StatusForm
                    status={selectedRowKeys.length == 0 ? null : device.status}
                    devices={devices}
                    onCacnel={onHide}
                    clearSelectedRows={clearSelectedRows}
                />
            ),
        };
        onShow(modalPropertiesChangeStatus);
    };

    const showModalCreateVoucher = () => {
        const formDefaultValues = {
            type: false,
            unit: filteredDevices[0].unit._id,
            devices: selectedRowKeys.map((deviceKey) => {
                const device = filteredDevices.find((dev) => dev._id === deviceKey);
                return { serialNumber: device.serialNumber, deviceType: replaceApostrophe(device.deviceType) };
            }),
        };
        const modalPropertiesCreateVoucher = {
            title: "שובר חדש",
            maxWidth: "md",
            body: <VoucherStepper onCancel={onHide} projectId={projectId} formDefaultValues={formDefaultValues} isReturnVoucher={true} />,
        };
        onShow(modalPropertiesCreateVoucher);
    };

    const columns = [
        {
            title: "צ' מכשיר",
            dataIndex: "serialNumber",
            key: "serialNumber",
        },
        {
            title: "סטטוס",
            dataIndex: "status",
            key: "status",
            render: (_, { status }) => <Tag color={tagColors[status]}>{status}</Tag>,
        },
        {
            title: "סוג מכשיר",
            dataIndex: "deviceType",
            render: (_, row) => replaceApostrophe(row.deviceType),
            key: "deviceType",
        },
        {
            title: "פעולות",
            key: "menu",
            render: (_, row) => <CustomDropDown actions={menuActions} data={row} />,
        },
    ];
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    if (isLoading) {
        return <Loader />;
    }
    return (
        <Card>
            <div>{renderCount}</div>
            <CardHeader
                titleTypographyProps={{ variant: "h6" }}
                title='מכשירים בבצ"פ'
                action={
                    <>
                        {selectedStatus !== FIXED_OR_DEFFECTIVE && selectedRowKeys.length > 0 && (
                            <LightButton
                                variant="contained"
                                btncolor="info"
                                onClick={showModalChangeStatus}
                                icon={<SwapHorizIcon />}
                                size="small"
                            >
                                שנה סטטוס
                            </LightButton>
                        )}
                        {selectedStatus === FIXED_OR_DEFFECTIVE && selectedRowKeys.length > 0 && (
                            <LightButton
                                variant="contained"
                                btncolor="info"
                                onClick={showModalCreateVoucher}
                                icon={<SwapHorizIcon />}
                                size="small"
                            >
                                צור שובר ניפוק
                            </LightButton>
                        )}
                    </>
                }
            />
            <CardContent>
                <Box marginBottom={2}>
                    <Space size="small">
                        <SearchInput onSearch={handleSearchChange} />
                        <StatusFilter
                            checkIfStatusExists={checkIfStatusExists}
                            selectedStatus={selectedStatus}
                            handleStatusChange={handleStatusChange}
                        />
                    </Space>
                </Box>
                <Table
                    locale={{ emptyText: <EmptyData label="אין מכשירים להצגה" /> }}
                    rowSelection={selectedStatus != ALL && rowSelection}
                    dataSource={addKeysToArray(filteredDevices, "key", "_id")}
                    columns={columns}
                />
            </CardContent>
        </Card>
    );
};
export default ArrivedDevices;
