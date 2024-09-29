import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Space } from "antd";
import { useEffect, useState } from "react";
import { ALL, DeviceStatuses, FIXED_OR_DEFECTIVE, RETURNED, ReturnedStatuses, replaceApostrophe } from "../../../../Utils/utils";
import { useCustomModal } from "../../../../Components/store/CustomModalContext";
import { useProject } from "../../../../Components/store/ProjectContext";
import CustomCard from "../../../../Components/UI/CustomCard";
import SearchInput from "../../../../Components/UI/SearchInput";
import VoucherStepper from "../NewVoucher/VoucherStepper";
import StatusForm from "../StatusForm";
import DevicesInProjectTable from "./DevicesInProjectTable";
import StatusFilter from "./StatusFilter";
import CustomButton from "../../../../Components/UI/CustomButton/CustomButton";
import { SwapOutlined } from "@ant-design/icons";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
import { getAllProductsInProject } from "../../../../Utils/projectAPI";
import FilterMenu from "../../../../Components/UI/FilterMenu";
import { getAllUnits } from "../../../../Utils/unitAPI";
import { getAllDeviceTypes } from "../../../../Utils/deviceTypeApi";

const ArrivedDevices = () => {
    const { onAlert, error } = useUserAlert();
    const { projectId } = useProject();
    const { onShow, onHide } = useCustomModal();
    const { data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const { data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
    const [searchParam, setSearchParam] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(ALL);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedDevicesIds, setSelectedDevicesIds] = useState([]);
    const [selectedAccessoriesIds, setSelectedAccessoriesIds] = useState([]);
    const queryClient = useQueryClient();
    const { isLoading, data: devices } = useQuery({
        queryKey: ["devicesInProject", projectId],
        queryFn: getAllProductsInProject,
        onSuccess: (data) => {
            setFilteredDevices(data);
            if (devices) handleSearchAndFilter(searchParam, data, selectedStatus);
        },
    });
    const [filteredDevices, setFilteredDevices] = useState(devices);

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
    }, [projectId, queryClient]);

    const clearSelectedRows = () => {
        setSelectedRows([]);
    };

    const handleSearchChange = (search) => {
        setSearchParam(search);
        handleSearchAndFilter(search, null, selectedStatus);
    };
    const onTabHandle = () => {
        if (filteredDevices.length === 1) {
            const device = filteredDevices[0];
            const newSelectedRowKeys = [device._id];
            onSelectChange(newSelectedRowKeys);
            return true;
        }
        return false;
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
            if (status == FIXED_OR_DEFECTIVE) {
                return (
                    device.status == DeviceStatuses.FIXED ||
                    device.status == DeviceStatuses.DEFECTIVE ||
                    device.status == DeviceStatuses.FINISHED
                );
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
        const keys = Object.keys(devicesStatusesGroup);
        if (status == RETURNED) {
            return (
                keys.includes(DeviceStatuses.DEFECTIVE_RETURN) ||
                keys.includes(DeviceStatuses.FIXED_RETURN) ||
                keys.includes(DeviceStatuses.FINISHED_OUT)
            );
        }
        if (status == FIXED_OR_DEFECTIVE || status == DeviceStatuses.FINISHED) {
            return keys.includes(DeviceStatuses.DEFECTIVE) || keys.includes(DeviceStatuses.FIXED) || keys.includes(DeviceStatuses.FINISHED);
        }
        return keys.includes(status);
    };

    const showModalChangeStatus = () => {
        const device = filteredDevices.find((dev) => dev._id === selectedRows[0]);
        const devices = filteredDevices.filter((device) => selectedRows.includes(device._id));
        onShow({
            title: "שינוי סטטוס",
            name: "status",
            body: (
                <StatusForm
                    status={selectedRows.length == 0 ? null : device.status}
                    isClassified={device.deviceTypeId.isClassified}
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
            unit: { text: filteredDevices[0].unit.unitsName, value: filteredDevices[0].unit._id },
            devicesIds: selectedDevicesIds,
            accessoriesIds: selectedAccessoriesIds,
            projectId,
        };
        onShow({
            title: "שובר חדש",
            name: "voucherStepper",
            width: "60%",
            body: <VoucherStepper onCancel={() => onHide("voucherStepper")} projectId={projectId} formDefaultValues={formDefaultValues} />,
        });
    };
    const onSelectChange = (newSelectedRowKeys) => {
        const selectedDevices = devices.filter((device) => newSelectedRowKeys.includes(device._id));
        const uniqueUnitIds = new Set(selectedDevices.map((device) => device.unit._id));
        const uniqueIsClassified = new Set(selectedDevices.map((device) => device.deviceTypeId.isClassified));

        const hasTwoDifferentUnits = uniqueUnitIds.size >= 2;
        const hasDifferentClassification = uniqueIsClassified.size >= 2;

        const classifiedDevices = selectedDevices.filter((device) => device.deviceTypeId.isClassified);
        const nonClassifiedDevices = selectedDevices.filter((device) => !device.deviceTypeId.isClassified);

        const classifiedDevicesValid = classifiedDevices.every((device) => device.status === "תקין" || device.status === "מושבת");
        const nonClassifiedDevicesValid = nonClassifiedDevices.every((device) => device.status === "הסתיים");
        if (!hasTwoDifferentUnits && (!hasDifferentClassification || (classifiedDevicesValid && nonClassifiedDevicesValid))) {
            setSelectedRows(newSelectedRowKeys);
            setSelectedDevicesIds(classifiedDevices.map((device) => device._id));
            setSelectedAccessoriesIds(nonClassifiedDevices.map((accessory) => accessory._id));
        } else {
            onAlert("אין אפשרות לבחור מכשירים שלא מאותה יחידה או לבחור צל\"ם או צ' ביחד", error, true);
        }
    };
    const areClassifiedAndNonClassifiedSelected = () => {
        const selectedDevices = devices.filter((device) => selectedRows.includes(device._id));
        const classifiedDevices = selectedDevices.some((device) => device.deviceTypeId.isClassified);
        const nonClassifiedDevices = selectedDevices.some((device) => !device.deviceTypeId.isClassified);

        return classifiedDevices && nonClassifiedDevices;
    };
    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
        selections: [
            {
                key: "clear",
                text: "נקה בחירה",
                onSelect: () => {
                    onSelectChange([]);
                },
            },
            {
                key: "devices",
                text: "בחר רק מסווגים",
                onSelect: (changeableRowKeys) => {
                    const classifiedRowKeys = changeableRowKeys.filter((key) => {
                        const device = devices.find((dev) => dev._id === key);
                        return device?.deviceTypeId?.isClassified;
                    });
                    onSelectChange(classifiedRowKeys);
                },
            },
            {
                key: "accessories",
                text: 'בחר רק צ"לם',
                onSelect: (changeableRowKeys) => {
                    const accessoryRowKeys = changeableRowKeys.filter((key) => {
                        const device = devices.find((dev) => dev._id === key);
                        return !device?.deviceTypeId?.isClassified;
                    });
                    onSelectChange(accessoryRowKeys);
                },
            },
        ],
    };
    const uniqueUnits = [...new Set(devices?.map((device) => device.unit._id))];
    const uniqueDeviceTypes = [...new Set(devices?.map((device) => device.deviceTypeId._id))];
    const unitOptions = uniqueUnits.map((unitId) => {
        const unit = units.find((unit) => unit._id === unitId);
        return { label: unit.unitsName, value: unit._id };
    });
    unitOptions.unshift({ value: "all", label: "הכל" });

    const deviceTypeOptions = uniqueDeviceTypes.map((deviceTypeId) => {
        const deviceType = deviceTypes.find((deviceType) => deviceType._id === deviceTypeId);
        return { label: deviceType.deviceName, value: deviceType._id };
    });
    deviceTypeOptions.unshift({ value: "all", label: "הכל" });
    return (
        <CustomCard
            title='מכשירים בבצ"פ'
            action={
                <Space size="small">
                    {/* <FilterMenu
                        filtersConfig={[
                            {
                                name: "unit",
                                label: "יחידות",
                                type: "select",
                                value: "all",
                                options: unitOptions,
                            },
                            {
                                name: "classified",
                                label: "מסווג",
                                type: "radio",
                                value: "all", // Could be true for classified, false for non-classified, null for all
                                options: [
                                    { label: "הכל", value: "all" },
                                    { label: "מסווג", value: "classfied" },
                                    { label: "לא מסווג", value: "nonClassified" },
                                ],
                            },
                            {
                                name: "deviceType",
                                label: "מכשירים",
                                type: "select",
                                value: "all",
                                options: deviceTypeOptions,
                            },
                        ]}
                        clearAllFilters={() => {
                            alert("clear");
                        }}
                        onFilterChange={(data) => {
                            alert(JSON.stringify(data));
                        }}
                    /> */}
                    {selectedRows.length > 0 && !areClassifiedAndNonClassifiedSelected() && (
                        <CustomButton type="light-info" onClick={showModalChangeStatus} iconPosition="end" icon={<SwapOutlined />}>
                            שנה סטטוס
                        </CustomButton>
                    )}
                    {selectedStatus === FIXED_OR_DEFECTIVE && selectedRows.length > 0 && (
                        <CustomButton type="light-success" onClick={showModalCreateVoucher} iconPosition="end" icon={<SwapOutlined />}>
                            צור שובר ניפוק
                        </CustomButton>
                    )}
                </Space>
            }
        >
            <div className="mb-3">
                {!isLoading && (
                    <Space size="small">
                        <SearchInput onSearch={handleSearchChange} onTabHandle={onTabHandle} />
                        <StatusFilter
                            checkIfStatusExists={checkIfStatusExists}
                            selectedStatus={selectedStatus}
                            handleStatusChange={handleStatusChange}
                        />
                    </Space>
                )}
            </div>
            <DevicesInProjectTable
                isActionsHidden={false}
                filteredDevices={filteredDevices}
                rowSelection={![ALL, RETURNED, DeviceStatuses.FINISHED_OUT].includes(selectedStatus) ? rowSelection : undefined}
                defaultPageSize={25}
                handleStatusChange={handleStatusChange}
                isLoading={isLoading}
            />
        </CustomCard>
    );
};
export default ArrivedDevices;
