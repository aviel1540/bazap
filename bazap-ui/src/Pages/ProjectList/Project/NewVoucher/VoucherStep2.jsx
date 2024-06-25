import HighlightOff from "@mui/icons-material/HighlightOff";
import { Box, IconButton, createFilterOptions } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Row, Space, Tabs } from "antd";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import Loader from "../../../../Components/Layout/Loader";
import ControlledInput from "../../../../Components/UI/CustomForm/ControlledInput";
import { useProject } from "../../../../Components/store/ProjectContext";
import { getDeviceBySerialNumber, getDevices } from "../../../../Utils/deviceApi";
import { getAllDeviceTypes } from "../../../../Utils/deviceTypeApi";
import { DeviceStatuses, FIXED_OR_DEFECTIVE } from "../../../../Utils/utils";
import DevicesInProjectTable from "../DevicesInProject/DevicesInProjectTable";
import ImportExcel from "./ImportExcel";
import CustomButton from "../../../../Components/UI/CustomButton";
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
const filter = createFilterOptions();

const VoucherStep2 = () => {
    const { onAlert, error } = useUserAlert();
    const [disabledFields, setDisabledFields] = useState({});
    const [activeTab, setActiveTab] = useState("Devices"); // State to manage active tab
    const { projectId } = useProject();
    const { getValues, control, setValue } = useFormContext();
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const isDeliveryVoucher = getValues("type") == "false";
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
                return device.status == DeviceStatuses.FIXED || device.status == DeviceStatuses.DEFECTIVE;
            });
            setFilteredDevices(newFilteredDevices);
            return newFilteredDevices;
        },
    });
    const { isLoading: isLoadingDevicesTypes, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
    const { deviceTypeOptions, accessoriesTypes } = useMemo(() => {
        const deviceTypeOptions = [];
        const accessoriesTypes = [];

        deviceTypes?.forEach((deviceType) => {
            const option = { text: deviceType.deviceName, value: deviceType._id };
            if (deviceType.isClassified) {
                deviceTypeOptions.push(option);
            } else {
                accessoriesTypes.push(option);
            }
        });

        return { deviceTypeOptions, accessoriesTypes };
    }, [deviceTypes]);

    useEffect(() => {
        if (isDeliveryVoucher) {
            refetch();
            const selectedIds = getValues().devicesIds;
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
        fields: accessories,
        append: addAccessory,
        remove: removeAccessory,
    } = useFieldArray({
        rules: { minLength: 1 },
        control,
        name: "accessoriesData",
    });

    const handleAddDevice = () => {
        addDevice({ serialNumber: "", deviceType: "" });
    };
    const handleAddAccessory = () => {
        addAccessory({ quantity: 1, deviceTypeId: null });
    };

    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber);
    const handleFieldChange = async (serialNumber, index) => {
        setDisabledFields((prev) => {
            const updatedState = { ...prev };
            delete updatedState[index];
            return updatedState;
        });
        setValue(`devicesData[${index}].deviceTypeId`, "");
        if (serialNumber) {
            const data = await getDeviceBySerialNumberMutation.mutateAsync(serialNumber);
            if (!data.message) {
                setDisabledFields((prev) => ({ ...prev, [index]: true }));
                setValue(`devicesData[${index}].deviceTypeId`, data.deviceTypeId);
            }
        }
    };

    const validateSerialNumber = (value, formValues) => {
        let result = validateDuplicateSerialNumbersInFields(value, formValues);
        if (result == true) {
            result = validateDuplicateSerialNumbersInDB(value, allDevices);
        }
        return result;
    };
    const combinedFields = (fields, inputs, removeHandler) => (
        <>
            {fields.length == 0 && <EmptyData label="אין מידע להציג" />}
            {fields.map((field, index) =>
                inputs.map((input, fieldIndex) => (
                    <Fragment key={`${field.id}.${index}.${fieldIndex}`}>
                        <Col span={10}>
                            <Controller
                                name={`${input.namePrefix}[${index}].${input.name}`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <ControlledInput
                                        {...field}
                                        label={input.label}
                                        onChange={input.onChange}
                                        onFieldChange={input.onFieldChange}
                                        type={input.type}
                                        isNumber={input.isNumber}
                                        validators={input.validators}
                                        options={input.options}
                                        getOptionLabel={input.getOptionLabel}
                                        filterOptions={input.filterOptions}
                                        inputRef={field.ref}
                                        index={index}
                                        disabled={disabledFields && disabledFields[index]}
                                        isStandardOption={input.isStandardOption}
                                    />
                                )}
                            />
                        </Col>
                        <Col>
                            {fieldIndex % 2 === 1 && (
                                <IconButton size="large" color="error" aria-label="deleteField" onClick={() => removeHandler(index)}>
                                    <HighlightOff fontSize="inherit" />
                                </IconButton>
                            )}
                        </Col>
                    </Fragment>
                )),
            )}
        </>
    );

    const onSelectChange = (newSelectedRowKeys) => {
        const selectedDevices = allDevices.filter((device) => newSelectedRowKeys.includes(device._id));
        const uniqueUnitIds = new Set(selectedDevices.map((device) => device.unit._id));
        const uniqueIsClassified = new Set(selectedDevices.map((device) => device.deviceTypeId.isClassified));

        const hasTwoDifferentUnits = uniqueUnitIds.size >= 2;
        const hasDifferentClassification = uniqueIsClassified.size >= 2;

        if (!hasTwoDifferentUnits && !hasDifferentClassification) {
            setSelectedRows(newSelectedRowKeys);
            setValue("devicesIds", newSelectedRowKeys);
        } else {
            onAlert("אין אפשרות לבחור מכשירים שלא מאותה יחידה או לבחור צל\"מ או צ' ביחד", error, true);
        }
    };

    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
    };

    const deviceInputs = [
        {
            label: "צ' מכשיר",
            name: "serialNumber",
            type: "AutoComplete",
            isNumber: true,
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
            validators: {
                required: "יש למלא שדה זה.",
            },
            options: deviceTypeOptions,
            namePrefix: "devicesData",
        },
    ];
    const accessoryInputs = [
        {
            label: "סוג מכשיר",
            name: "deviceTypeId",
            type: "AutoComplete",
            isStandardOption: true,
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
            <ImportExcel
                fields={deviceFields}
                getValues={getValues}
                append={addDevice}
                remove={removeDevice}
                setDisabledFields={setDisabledFields}
                isDeliveryVoucher={isDeliveryVoucher}
                setSelectedRowKeys={setSelectedRows}
            />
            <Box padding={2}>
                {isLoading && <Loader />}
                {!isLoading && !isDeliveryVoucher && (
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        type="card"
                        items={[
                            {
                                label: `מכשירים (${deviceFields.length})`,

                                children: (
                                    <>
                                        <Row gutter={[10, 10]}>{combinedFields(deviceFields, deviceInputs, removeDevice)}</Row>
                                        <Box textAlign="center" marginTop={1}>
                                            <Space>
                                                <CustomButton
                                                    type="light-success"
                                                    iconPosition="end"
                                                    onClick={handleAddDevice}
                                                    icon={<PlusOutlined />}
                                                >
                                                    הוסף מכשיר
                                                </CustomButton>
                                            </Space>
                                        </Box>
                                    </>
                                ),
                                key: "Devices",
                            },
                            {
                                label: `צל"מ`,
                                children: (
                                    <>
                                        <Row gutter={[10, 10]}>{combinedFields(accessories, accessoryInputs, removeAccessory)}</Row>
                                        <Box textAlign="center" marginTop={1}>
                                            <Space>
                                                <CustomButton
                                                    type="light-success"
                                                    iconPosition="end"
                                                    onClick={handleAddAccessory}
                                                    icon={<PlusOutlined />}
                                                >
                                                    הוסף צל&quot;מ
                                                </CustomButton>
                                            </Space>
                                        </Box>
                                    </>
                                ),
                                key: "Accessories",
                            },
                        ]}
                    ></Tabs>
                )}
                {isDeliveryVoucher && (
                    <DevicesInProjectTable
                        isLoading={isLoading}
                        filteredDevices={filteredDevices}
                        selectedStatus={FIXED_OR_DEFECTIVE}
                        rowSelection={rowSelection}
                        defaultPageSize={25}
                    />
                )}
            </Box>
        </>
    );
};

export default VoucherStep2;

// const combinedFields = () => {
//     const deviceInputs = [
//         {
//             label: "צ' מכשיר",
//             name: "serialNumber",
//             type: "AutoComplete",
//             isNumber: true,
//             validators: {
//                 required: "יש למלא שדה זה.",
//                 minLength: { value: 4, message: "צ' מכשיר צריך לפחות 4 תווים" },
//                 validate: validateSerialNumber,
//             },
//             options: isDeliveryVoucher ? [] : convertDeivcesToACOptions(allDevices),
//             getOptionLabel: onGetOptionLabel,
//             filterOptions: (options, params) => onFilterOptions(options, params, isDeliveryVoucher, filter),
//             onFieldChange: handleFieldChange,
//         },
//         {
//             label: "סוג מכשיר",
//             name: "deviceTypeId",
//             type: "select",
//             validators: {
//                 required: "יש למלא שדה זה.",
//             },
//             options: deviceTypeOptions,
//         },
//     ];
//     const accessoryInputs = [
//         {
//             label: "סוג מכשיר",
//             name: "deviceType",
//             type: "AutoComplete",
//             validators: {
//                 required: "יש למלא שדה זה.",
//             },
//             options: deviceTypes
//                 .filter((deviceType) => deviceType.isClassified)
//                 .map((dType) => {
//                     return { text: dType.deviceName, value: dType._id, ...dType };
//                 }),
//         },
//         {
//             label: "כמות",
//             name: "quantity",
//             type: "number",
//             isNumber: true,
//             validators: {
//                 required: "יש למלא שדה זה.",
//                 min: {
//                     value: 1,
//                     message: "כמות חייב להיות גדול או שווה ל1",
//                 },
//             },
//             options: deviceTypeOptions,
//         },
//     ];

//     const handleRemoveDeviceField = (index) => {
//         removeDevice(index);
//         setDisabledFields((prev) => {
//             const updatedState = { ...prev };
//             delete updatedState[index];
//             return updatedState;
//         });
//     };

//     const handleRemoveAccessoryField = (index) => {
//         removeAccessory(index);
//     };
//     return (
//         <>
//             {deviceFields.map((field, index) =>
//                 deviceInputs.map((input, deviceFieldIndex) => (
//                     <Fragment key={`${field.id}.${index}.${deviceFieldIndex}`}>
//                         <Col span={10}>
//                             <Controller
//                                 name={`devices[${index}].${input.name}`}
//                                 control={control}
//                                 defaultValue=""
//                                 render={({ field }) => (
//                                     <ControlledInput
//                                         {...field}
//                                         label={input.label}
//                                         onFieldChange={input.onFieldChange}
//                                         type={input.type}
//                                         isNumber={input.isNumber}
//                                         validators={input.validators}
//                                         options={input.options}
//                                         getOptionLabel={input.getOptionLabel}
//                                         filterOptions={input.filterOptions}
//                                         inputRef={field.ref}
//                                         index={index}
//                                         disabled={disabledFields && disabledFields[index]}
//                                     />
//                                 )}
//                             />
//                         </Col>
//                         <Col>
//                             {deviceFieldIndex % 2 === 1 && (
//                                 <IconButton
//                                     size="large"
//                                     color="error"
//                                     aria-label="deleteDevice"
//                                     onClick={() => handleRemoveDeviceField(index)}
//                                 >
//                                     <HighlightOff fontSize="inherit" />
//                                 </IconButton>
//                             )}
//                         </Col>
//                     </Fragment>
//                 )),
//             )}
//         </>
//     );
// };
