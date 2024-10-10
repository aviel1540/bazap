import { Flex, InputNumber, Select, Tabs, Tooltip } from "antd";
import { Fragment, useMemo, useState } from "react";
import CustomButton from "../../../../Components/UI/CustomButton/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import { getAllDeviceTypes } from "../../../../Utils/deviceTypeApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../Components/Layout/Loader";
import { getDevices } from "../../../../Utils/deviceApi";
import PropTypes from "prop-types";

const smartInsertInitialState = { quantity: 1, deviceType: null, unit: null };
const VoucherTabs = ({ renderFields }) => {
    const { isLoading: isLoadingArrivedDevices, data: allDevices } = useQuery({
        queryKey: ["allDevices"],
        queryFn: getDevices,
    });
    const [activeTab, setActiveTab] = useState("devices");
    const [smartInsert, setSmartInsert] = useState(smartInsertInitialState);
    const onAddNewDevice = (add) => {
        for (let i = 0; i < smartInsert.quantity; i++) {
            add({ deviceType: smartInsert.deviceType, unit: smartInsert.unit });
        }
        setSmartInsert(smartInsertInitialState);
    };
    const handleSmartInsertChange = (value, key) => {
        setSmartInsert((prev) => {
            return { ...prev, [key]: value };
        });
    };
    const { isLoading: isLoadingDevicesTypes, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
    const { deviceTypeOptions, accessoriesTypes } = useMemo(() => {
        const deviceTypeOptions = [];
        const accessoriesTypes = [];

        deviceTypes?.forEach((deviceType) => {
            const option = { label: `${deviceType.deviceName} - ${deviceType.catalogNumber}`, value: deviceType._id };
            if (deviceType.isClassified) {
                deviceTypeOptions.push(option);
            } else {
                accessoriesTypes.push(option);
            }
        });

        return { deviceTypeOptions, accessoriesTypes };
    }, [deviceTypes]);
    const isLoading = isLoadingDevicesTypes || isLoadingArrivedDevices;
    const convertDeivcesToACOptions = (data) => {
        const uniqueDevices = [];
        if (data) {
            data.forEach((device) => {
                if (uniqueDevices.findIndex((d) => d.label === device.serialNumber) === -1) {
                    uniqueDevices.push({ label: device.serialNumber, value: device.serialNumber });
                }
            });
        }
        return uniqueDevices;
    };
    const devicesFields = [
        {
            name: "devices",
            label: "",
            type: "list",
            listFields: [
                {
                    name: "serialNumber",
                    type: "autocomplete",
                    label: "צ' מכשיר",
                    onChange: (value, clearErrors, field, parentField, form) =>
                        handleSerialNumberChange(value, clearErrors, field, parentField, form),
                    options: convertDeivcesToACOptions(allDevices),
                    rules: [{ required: true, message: "יש להזין צ'" }],
                },
                {
                    name: "deviceType",
                    type: "select",
                    label: "סוג מכשיר",
                    options: deviceTypeOptions,
                    rules: [{ required: true, message: "יש לבחור סוג מכשיר" }],
                },
                {
                    name: "notes",
                    type: "text",
                    label: "הערות",
                    rules: [],
                },
            ],
            addButton: (add) => {
                return (
                    <>
                        {isLoading && <Loader />}
                        {!isLoading && (
                            <Flex justify="center" align="center" gap={4} className="mt-4">
                                <InputNumber
                                    min={1}
                                    max={100}
                                    addonBefore="כמות"
                                    onChange={(val) => handleSmartInsertChange(val, "quantity")}
                                    className="w-125px"
                                    value={smartInsert.quantity}
                                />
                                <Select
                                    showSearch
                                    placeholder="בחר סוג מכשיר להוספה חכמה"
                                    optionFilterProp="label"
                                    value={smartInsert.deviceType}
                                    onChange={(val) => handleSmartInsertChange(val, "deviceType")}
                                    options={deviceTypeOptions}
                                    className="w-250px"
                                    allowClear={true}
                                />
                                {/* onClick={handleAddDevice} */}
                                <CustomButton
                                    type="light-success"
                                    iconPosition="end"
                                    onClick={() => onAddNewDevice(add)}
                                    icon={<PlusOutlined />}
                                >
                                    הוסף מכשיר
                                </CustomButton>
                            </Flex>
                        )}
                    </>
                );
            },
        },
    ];
    const accessoriesFields = [
        {
            name: "accessories",
            addButton: (add) => {
                return (
                    <Flex justify="center" align="center" gap={4} className="mt-4">
                        <CustomButton type="light-success" iconPosition="end" onClick={() => add({ quantity: 1 })} icon={<PlusOutlined />}>
                            הוסף צל&quot;מ
                        </CustomButton>
                    </Flex>
                );
            },
            label: "",
            type: "list",
            listFields: [
                {
                    name: "deviceType",
                    type: "select",
                    label: "סוג מכשיר",
                    options: accessoriesTypes,
                    rules: [{ required: true, message: "יש לבחור סוג מכשיר" }],
                },
                {
                    name: "quantity",
                    type: "number",
                    label: "כמות",
                    rules: [{ required: true, message: "יש להזין כמות" }],
                },
            ],
        },
    ];
    const handleSerialNumberChange = (value, clearErrors, field, parentField, form) => {
        const fieldName = parentField.name + "deviceType";
        const device = allDevices.find((d) => d.serialNumber === value);
        if (device) {
            form.setFieldValue(fieldName, device.deviceTypeId);
        }
    };

    return (
        <Tabs
            tabBarExtraContent={
                <Tooltip title="הוסף סוג מכשיר חדשה">
                    <CustomButton type="light-primary" icon={<PlusOutlined />} />
                </Tooltip>
            }
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={[
                {
                    label: `מסווגים`,
                    children: <Fragment key="devices-tab">{renderFields(devicesFields)}</Fragment>,
                    key: "devices",
                },
                {
                    label: `צל"מ`,
                    children: <Fragment key="accessories-tab">{renderFields(accessoriesFields)}</Fragment>,
                    key: "accessories",
                },
            ]}
        />
    );
};

VoucherTabs.propTypes = {
    renderFields: PropTypes.func.isRequired,
};

export default VoucherTabs;
