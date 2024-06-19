import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Space } from "antd";
import { useEffect, useState } from "react";
import { getAllDevicesInProject } from "../../../../Utils/deviceApi";
import { ALL, DeviceStatuses, FIXED_OR_DEFFECTIVE, RETURNED, ReturnedStatuses, replaceApostrophe } from "../../../../Utils/utils";
import { useCustomModal } from "../../../../Components/store/CustomModalContext";
import { useProject } from "../../../../Components/store/ProjectContext";
import CustomCard from "../../../../Components/UI/CustomCard";
import SearchInput from "../../../../Components/UI/SearchInput";
import VoucherStepper from "../NewVoucher/VoucherStepper";
import StatusForm from "../StatusForm";
import DevicesInProjectTable from "./DevicesInProjectTable";
import StatusFilter from "./StatusFilter";
import CustomButton from "../../../../Components/UI/CustomButton";
import { SwapOutlined } from "@ant-design/icons";

const ArrivedDevices = () => {
    const { projectId } = useProject();
    const { onShow, onHide } = useCustomModal();
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [searchParam, setSearchParam] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(ALL);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const { isLoading, data: devices } = useQuery({
        queryKey: ["devicesInProject", projectId],
        queryFn: getAllDevicesInProject,
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
        onShow({
            title: "שינוי סטטוס",
            name: "status",
            body: (
                <StatusForm
                    status={selectedRowKeys.length == 0 ? null : device.status}
                    devices={devices}
                    onCancel={() => onHide("status")}
                    clearSelectedRows={clearSelectedRows}
                />
            ),
        });
    };

    const showModalCreateVoucher = () => {
        const formDefaultValues = {
            type: "false",
            unit: filteredDevices[0].unit._id,
            devicesIds: selectedRowKeys,
        };
        onShow({
            title: "שובר חדש",
            name: "voucherStepper",
            body: <VoucherStepper onCancel={() => onHide("voucherStepper")} projectId={projectId} formDefaultValues={formDefaultValues} />,
        });
    };
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <CustomCard
            title='מכשירים בבצ"פ'
            action={
                <Space size="small">
                    {selectedRowKeys.length > 0 && (
                        <CustomButton type="light-info" onClick={showModalChangeStatus} iconPosition="end" icon={<SwapOutlined />}>
                            שנה סטטוס
                        </CustomButton>
                    )}
                    {selectedStatus === FIXED_OR_DEFFECTIVE && selectedRowKeys.length > 0 && (
                        <CustomButton type="light-success" onClick={showModalCreateVoucher} iconPosition="end" icon={<SwapOutlined />}>
                            צור שובר ניפוק
                        </CustomButton>
                    )}
                </Space>
            }
        >
            <Box marginBottom={2}>
                {!isLoading && (
                    <Space size="small">
                        <SearchInput onSearch={handleSearchChange} />
                        <StatusFilter
                            checkIfStatusExists={checkIfStatusExists}
                            selectedStatus={selectedStatus}
                            handleStatusChange={handleStatusChange}
                        />
                    </Space>
                )}
            </Box>
            <DevicesInProjectTable
                filteredDevices={filteredDevices}
                rowSelection={selectedStatus != ALL && selectedStatus != RETURNED ? rowSelection : undefined}
                defaultPageSize={25}
                handleStatusChange={handleStatusChange}
                isLoading={isLoading}
            />
        </CustomCard>
    );
};
export default ArrivedDevices;
