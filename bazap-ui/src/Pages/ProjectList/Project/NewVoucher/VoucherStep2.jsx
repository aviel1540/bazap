import HighlightOff from "@mui/icons-material/HighlightOff";
import { IconButton, createFilterOptions } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Flex, InputNumber, Select, Tabs, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Loader from "../../../../Components/Layout/Loader";
import { useProject } from "../../../../Components/store/ProjectContext";
import { getDeviceBySerialNumber, getDevices } from "../../../../Utils/deviceApi";
import { getAllDeviceTypes } from "../../../../Utils/deviceTypeApi";
import { DeviceStatuses, FIXED_OR_DEFECTIVE } from "../../../../Utils/utils";
import DevicesInProjectTable from "../DevicesInProject/DevicesInProjectTable";
// import ImportExcel from "./ImportExcel";
import CustomButton from "../../../../Components/UI/CustomButton/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
import {
    convertDeivcesToACOptions,
    onFilterOptions,
    onGetOptionLabel,
    validateDuplicateSerialNumbersInDB,
    validateDuplicateSerialNumbersInFields,
} from "./utils";
import EmptyData from "../../../../Components/UI/EmptyData";
import { getAllProductsInProject } from "../../../../Utils/projectAPI";
import DeviceTypeForm from "../../../DeviceType/DeviceTypeForm";
import RenderFields from "../../../../Components/UI/CustomForm/RenderFields";
const filter = createFilterOptions();

const VoucherStep2 = () => {
    const [isDeviceTypeModalOpen, setIsDeviceTypeModalOpen] = useState(false);
    const [disabledFields, setDisabledFields] = useState({});
    const { onAlert, error } = useUserAlert();
    const [activeTab, setActiveTab] = useState("Devices"); // State to manage active tab
    const { projectId } = useProject();
    const { methods } = useFormContext();
    const { formMethods } = methods;
    const { getValues, setValue, control } = formMethods;
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const isDeliveryVoucher = getValues("type") == "false";
    const [totalDevices, setTotalDevices] = useState(1);
    const [predefinedDeviceType, setPredefinedDeviceType] = useState(null);
    const { isLoading: isLoadingArrivedDevices, data: allDevices } = useQuery({
        queryKey: ["allDevices"],
        queryFn: getDevices,
    });

    const { isLoading: isLaodingDevicesInProject, refetch } = useQuery({
        queryKey: ["fixedOrReturnedDevicesInProject", projectId],
        queryFn: getAllProductsInProject,
        enabled: false,
        onSuccess: (data) => {
            let newFilteredDevices = data.filter((device) => {
                return (
                    device.status == DeviceStatuses.FIXED ||
                    device.status == DeviceStatuses.DEFECTIVE ||
                    device.status == DeviceStatuses.FINISHED
                );
            });
            setFilteredDevices(newFilteredDevices);
            return newFilteredDevices;
        },
    });
    const { isLoading: isLoadingDevicesTypes, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
    const { deviceTypeOptions, accessoriesTypes, predefinedDeviceTypeOptions } = useMemo(() => {
        const deviceTypeOptions = [];
        const predefinedDeviceTypeOptions = [];
        const accessoriesTypes = [];

        deviceTypes?.forEach((deviceType) => {
            const option = { text: `${deviceType.deviceName} - ${deviceType.catalogNumber}`, value: deviceType._id };
            if (deviceType.isClassified) {
                predefinedDeviceTypeOptions.push({
                    value: deviceType._id,
                    label: deviceType.deviceName,
                });
                deviceTypeOptions.push(option);
            } else {
                accessoriesTypes.push(option);
            }
        });

        return { deviceTypeOptions, accessoriesTypes, predefinedDeviceTypeOptions };
    }, [deviceTypes]);

    useEffect(() => {
        if (isDeliveryVoucher) {
            refetch();
            let values = getValues();
            const selectedIds = [...values.devicesIds, ...values.accessoriesIds];
            setSelectedRows(selectedIds);
        }
    }, [isDeliveryVoucher, getValues, setSelectedRows, refetch]);

    const isLoading = isLoadingDevicesTypes || isLoadingArrivedDevices || (isDeliveryVoucher && isLaodingDevicesInProject);

    const {
        fields: deviceFields,
        append: addDevice,
        remove: removeDevice,
    } = useFieldArray({
        rules: { minLength: 1 },
        control,
        name: "devicesData",
    });

    const {
        fields: accessoriesFields,
        append: addAccessory,
        remove: removeAccessory,
    } = useFieldArray({
        rules: { minLength: 1 },
        control,
        name: "accessoriesData",
    });

    const handleAddDevice = () => {
        const newDevices = [];
        for (let index = 0; index < totalDevices; index++) {
            if (predefinedDeviceType != null) {
                newDevices.push({ serialNumber: "", deviceTypeId: predefinedDeviceType });
            } else {
                newDevices.push({ serialNumber: "", deviceTypeId: "" });
            }
        }
        addDevice(newDevices);
        setPredefinedDeviceType(null);
        setTotalDevices(1);
    };
    const handleAddAccessory = () => {
        addAccessory({ quantity: 1, deviceTypeId: null });
    };

    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber);
    const handleFieldChange = async (serialNumber, index) => {
        // const currentValue = getValues("devicesData[${index}].deviceTypeId");
        // if (currentValue != null)
        // setValue(`devicesData[${index}].deviceTypeId`, "");
        if (serialNumber) {
            const data = await getDeviceBySerialNumberMutation.mutateAsync(serialNumber);
            if (!data.message) {
                setDisabledFields((prev) => ({ ...prev, [`devicesData[${index}].deviceTypeId`]: true }));
                setValue(`devicesData[${index}].deviceTypeId`, data.deviceTypeId);
            } else {
                setDisabledFields((prev) => {
                    const newState = { ...prev };
                    delete newState[`devicesData[${index}].deviceTypeId`];
                    return newState;
                });
            }
        } else {
            setDisabledFields((prev) => {
                const newState = { ...prev };
                delete newState[`devicesData[${index}].deviceTypeId`];
                return newState;
            });
        }
    };

    const validateSerialNumber = (value, formValues) => {
        let result = validateDuplicateSerialNumbersInFields(value, formValues);
        if (result == true) {
            result = validateDuplicateSerialNumbersInDB(value, allDevices);
        }
        return result;
    };

    const onSelectChange = (newSelectedRowKeys) => {
        const selectedDevices = allDevices.filter((device) => newSelectedRowKeys.includes(device._id));
        const uniqueUnitIds = new Set(selectedDevices.map((device) => device.unit._id));
        const uniqueIsClassified = new Set(selectedDevices.map((device) => device.deviceTypeId.isClassified));

        const hasTwoDifferentUnits = uniqueUnitIds.size >= 2;
        const hasDifferentClassification = uniqueIsClassified.size >= 2;

        if (!hasTwoDifferentUnits && !hasDifferentClassification) {
            const classifiedDevicesIds = selectedDevices.filter((device) => device.deviceTypeId.isClassified).map((device) => device._id);

            const nonClassifiedAccessoriesIds = selectedDevices
                .filter((device) => !device.deviceTypeId.isClassified)
                .map((device) => device._id);

            setSelectedRows(newSelectedRowKeys);
            setValue("devicesIds", classifiedDevicesIds);
            setValue("accessoriesIds", nonClassifiedAccessoriesIds);
        } else {
            onAlert("אין אפשרות לבחור מכשירים שלא מאותה יחידה או לבחור צל\"מ או צ' ביחד", error, true);
        }
    };

    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
    };

    const showDeviceTypeModal = () => {
        setIsDeviceTypeModalOpen(true);
    };
    const handleCancel = () => {
        setIsDeviceTypeModalOpen(false);
    };
    const deviceInputs = [
        {
            label: "צ' מכשיר",
            name: "serialNumber",
            type: "AutoComplete",
            isNumber: true,
            colSpan: 8,
            validators: {
                required: "יש למלא שדה זה.",
                minLength: { value: 4, message: "צ' מכשיר צריך לפחות 4 תווים" },
                validate: validateSerialNumber,
            },
            options: isDeliveryVoucher ? [] : convertDeivcesToACOptions(allDevices),
            getOptionLabel: onGetOptionLabel,
            filterOptions: (options, params) => onFilterOptions(options, params, isDeliveryVoucher, filter),
            onFieldChange: handleFieldChange,
            namePrefix: "devicesData",
        },
        {
            label: "סוג מכשיר",
            name: "deviceTypeId",
            type: "select",
            colSpan: 8,

            validators: {
                required: "יש למלא שדה זה.",
            },
            options: deviceTypeOptions,
            namePrefix: "devicesData",
        },
        {
            label: "הערות",
            name: "notes",
            type: "text",
            colSpan: 6,
            extraSpan: 2,
            extraRender: (index) => {
                return (
                    <IconButton size="large" color="error" aria-label="deleteField" onClick={() => removeDevice(index)}>
                        <HighlightOff fontSize="inherit" />
                    </IconButton>
                );
            },
            namePrefix: "devicesData",
        },
    ];
    const accessoryInputs = [
        {
            label: "סוג מכשיר",
            name: "deviceTypeId",
            type: "AutoComplete",
            isStandardOption: true,
            colSpan: 12,
            validators: {
                required: "יש למלא שדה זה.",
            },
            getOptionLabel: onGetOptionLabel,
            options: accessoriesTypes,
            namePrefix: "accessoriesData",
        },
        {
            label: "כמות",
            name: "quantity",
            type: "number",
            isNumber: true,
            colSpan: 10,
            extraSpan: 2,
            extraRender: (index) => {
                return (
                    <IconButton size="large" color="error" aria-label="deleteField" onClick={() => removeAccessory(index)}>
                        <HighlightOff fontSize="inherit" />
                    </IconButton>
                );
            },
            validators: {
                required: "יש למלא שדה זה.",
                min: {
                    value: 1,
                    message: "כמות חייב להיות גדול או שווה ל-1",
                },
            },
            namePrefix: "accessoriesData",
        },
    ];

    return (
        <>
            {/* <ImportExcel
                fields={deviceFields}
                getValues={getValues}
                append={addDevice}
                remove={removeDevice}
                setDisabledFields={setDisabledFields}
                isDeliveryVoucher={isDeliveryVoucher}
                setSelectedRowKeys={setSelectedRows}
            /> */}
            {isLoading && <Loader />}
            {!isLoading && !isDeliveryVoucher && (
                <Tabs
                    tabBarExtraContent={
                        <Tooltip title="הוסף סוג מכשיר חדשה">
                            <CustomButton type="light-primary" onClick={showDeviceTypeModal} icon={<PlusOutlined />} />
                        </Tooltip>
                    }
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    type="card"
                    items={[
                        {
                            label: `מכשירים (${deviceFields.length})`,

                            children: (
                                <>
                                    <RenderFields
                                        disabledFields={disabledFields}
                                        stepFields={deviceInputs}
                                        fieldArray={deviceFields}
                                        fieldKey="devicesData"
                                    />
                                    {deviceFields.length == 0 && <EmptyData label="אין מידע להציג" />}
                                    <Flex justify="center" align="center" gap={4} className="mt-4">
                                        <InputNumber
                                            min={1}
                                            max={100}
                                            addonBefore="כמות"
                                            onChange={(val) => setTotalDevices(val)}
                                            className="w-125px"
                                            value={totalDevices}
                                        />
                                        <Select
                                            showSearch
                                            placeholder="בחר סוג מכשיר להוספה חכמה"
                                            optionFilterProp="label"
                                            value={predefinedDeviceType}
                                            onChange={(e) => setPredefinedDeviceType(e)}
                                            options={predefinedDeviceTypeOptions}
                                            className="w-250px"
                                            allowClear={true}
                                        />
                                        <CustomButton
                                            type="light-success"
                                            iconPosition="end"
                                            onClick={handleAddDevice}
                                            icon={<PlusOutlined />}
                                        >
                                            הוסף מכשיר
                                        </CustomButton>
                                    </Flex>
                                </>
                            ),
                            key: "Devices",
                        },
                        {
                            label: `צל"מ (${accessoriesFields.length})`,
                            children: (
                                <>
                                    <RenderFields stepFields={accessoryInputs} fieldArray={accessoriesFields} fieldKey="accessoriesData" />
                                    {accessoriesFields.length == 0 && <EmptyData label="אין מידע להציג" />}
                                    <Flex justify="center" align="center" className="mt-4">
                                        <CustomButton
                                            type="light-success"
                                            iconPosition="end"
                                            onClick={handleAddAccessory}
                                            icon={<PlusOutlined />}
                                        >
                                            הוסף צל&quot;מ{" "}
                                        </CustomButton>
                                    </Flex>
                                </>
                            ),
                            key: "Accessories",
                        },
                    ]}
                ></Tabs>
            )}
            {
                <div>
                    {isDeliveryVoucher && (
                        <DevicesInProjectTable
                            isActionsHidden={true}
                            isLoading={isLoading}
                            filteredDevices={filteredDevices}
                            selectedStatus={FIXED_OR_DEFECTIVE}
                            rowSelection={rowSelection}
                            defaultPageSize={25}
                        />
                    )}
                </div>
            }
            <DeviceTypeForm
                formValues={null} // Pass data for editing
                open={isDeviceTypeModalOpen} // Control modal visibility
                onCancel={handleCancel} // Handle cancel/close modal
                isEdit={false} // Pass isEdit flag
            />
        </>
    );
};

export default VoucherStep2;
