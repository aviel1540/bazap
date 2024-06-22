import HighlightOff from "@mui/icons-material/HighlightOff";
import { Box, IconButton, createFilterOptions } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Row, Space } from "antd";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import Loader from "../../../../Components/Layout/Loader";
import ControlledInput from "../../../../Components/UI/CustomForm/ControlledInput";
import { useProject } from "../../../../Components/store/ProjectContext";
import { getAllDevicesInProject, getDeviceBySerialNumber, getDevices } from "../../../../Utils/deviceApi";
import { getAllDeviceTypes } from "../../../../Utils/deviceTypeApi";
import { checkDuplicationInForm } from "../../../../Utils/formUtils";
import { DeviceStatuses, FIXED_OR_DEFFECTIVE } from "../../../../Utils/utils";
import DevicesInProjectTable from "../DevicesInProject/DevicesInProjectTable";
import ImportExcel from "./ImportExcel";
import CustomButton from "../../../../Components/UI/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
const filter = createFilterOptions();

const convertDeivcesToACOptions = (data) => {
    const uniqueDevices = [];
    if (data) {
        data.forEach((device) => {
            if (uniqueDevices.findIndex((d) => d.text === device.serialNumber) === -1) {
                uniqueDevices.push({ text: device.serialNumber });
            }
        });
    }
    return uniqueDevices;
};

const VoucherStep2 = () => {
    const { onAlert, error } = useUserAlert();
    const [disabledFields, setDisabledFields] = useState({});
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
        queryFn: getAllDevicesInProject,
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
    const deviceTypeOptions = deviceTypes?.map((dType) => {
        return { text: dType.deviceName, value: dType._id, ...dType };
    });

    useEffect(() => {
        if (isDeliveryVoucher) {
            refetch();
            const selectedIds = getValues().devicesIds;
            setSelectedRows(selectedIds);
        }
    }, [isDeliveryVoucher]);

    const isLoading = isLoadingDevicesTypes || isLoadingArrivedDevices || (isDeliveryVoucher && isLaodingDevicesInProject);

    const {
        fields: deviceFields,
        append: addDevice,
        remove: removeDevice,
    } = useFieldArray({
        rules: { minLength: 1 },
        control,
        name: "devices",
    });

    const {
        fields: accessories,
        append: addAccessory,
        remove: removeAccessory,
    } = useFieldArray({
        rules: { minLength: 1 },
        control,
        name: "accessories",
    });

    const handleAddDevice = () => {
        addDevice({ serialNumber: "", deviceType: "" });
    };

    const handleAddAccessory = () => {
        addAccessory({ quantity: 1, deviceType: "" });
    };

    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber);
    const handleFieldChange = async (serialNumber, index) => {
        setDisabledFields((prev) => {
            const updatedState = { ...prev };
            delete updatedState[index];
            return updatedState;
        });
        setValue(`devices[${index}].deviceType`, "");
        if (serialNumber) {
            const data = await getDeviceBySerialNumberMutation.mutateAsync(serialNumber);
            if (!data.message) {
                setDisabledFields((prev) => ({ ...prev, [index]: true }));
                setValue(`devices[${index}].deviceType`, data.deviceType);
            }
        }
    };

    const onGetOptionLabel = (option) => {
        if (typeof option === "string") {
            return option;
        }
        return option.text;
    };

    const onFilterOptions = (options, params, isDeliveryVoucher, filter) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some((option) => inputValue === option.text);
        if (!isDeliveryVoucher) {
            if (inputValue !== "" && !isExisting) {
                filtered.push({
                    inputValue,
                    text: `הוסף צ' "${inputValue}"`,
                });
            }
        }

        return filtered;
    };
    const validateSerialNumber = (value, formValues) => {
        let result = validateDuplicateSerialNumbersInFields(value, formValues);
        if (result == true) {
            result = validateDuplicateSerialNumbersInDB(value);
        }
        return result;
    };
    const validateDuplicateSerialNumbersInFields = (value, formValues) => {
        const foundedDevices = formValues.devices.filter((device) => device.serialNumber === value);
        if (foundedDevices.length > 1) return "צ' מכשיר לא יכול להופיע פעמיים.";
        return true;
    };
    const validateDuplicateSerialNumbersInDB = (value) => {
        if (value) {
            const devices = allDevices.filter((device) => !device.voucherOut);
            if (checkDuplicationInForm(devices, "serialNumber", value, false, undefined)) return "צ' כבר קיים באחד מהפרוייקטים.";
        }
        return true;
    };

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
    const combinedFields = () => {
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
            },
            {
                label: "סוג מכשיר",
                name: "deviceTypeId",
                type: "select",
                validators: {
                    required: "יש למלא שדה זה.",
                },
                options: deviceTypeOptions,
            },
        ];

        const accessoryInputs = [
            {
                label: "סוג מכשיר",
                name: "deviceType",
                type: "AutoComplete",
                validators: {
                    required: "יש למלא שדה זה.",
                },
                options: deviceTypes
                    .filter((deviceType) => deviceType.isClassified)
                    .map((dType) => {
                        return { text: dType.deviceName, value: dType._id, ...dType };
                    }),
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
                        message: "כמות חייב להיות גדול או שווה ל1",
                    },
                },
            },
        ];

        const handleRemoveDeviceField = (index) => {
            removeDevice(index);
            setDisabledFields((prev) => {
                const updatedState = { ...prev };
                delete updatedState[index];
                return updatedState;
            });
        };

        const handleRemoveAccessoryField = (index) => {
            removeAccessory(index);
        };

        return (
            <>
                {deviceFields.map((field, index) =>
                    deviceInputs.map((input, deviceFieldIndex) => (
                        <Fragment key={`${field.id}.${index}.${deviceFieldIndex}`}>
                            <Col span={10}>
                                <Controller
                                    name={`devices[${index}].${input.name}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <ControlledInput
                                            {...field}
                                            label={input.label}
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
                                        />
                                    )}
                                />
                            </Col>
                            <Col>
                                {deviceFieldIndex % 2 === 1 && (
                                    <IconButton
                                        size="large"
                                        color="error"
                                        aria-label="deleteDevice"
                                        onClick={() => handleRemoveDeviceField(index)}
                                    >
                                        <HighlightOff fontSize="inherit" />
                                    </IconButton>
                                )}
                            </Col>
                        </Fragment>
                    )),
                )}

                {accessories.map((field, index) =>
                    accessoryInputs.map((input, accessoryFieldIndex) => (
                        <Fragment key={`${field.id}.${index}.${accessoryFieldIndex}`}>
                            <Col span={10}>
                                <Controller
                                    name={`accessories[${index}].${input.name}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <ControlledInput
                                            {...field}
                                            label={input.label}
                                            onFieldChange={input.onFieldChange}
                                            type={input.type}
                                            isNumber={input.isNumber}
                                            validators={input.validators}
                                            options={input.options}
                                            getOptionLabel={input.getOptionLabel}
                                            filterOptions={input.filterOptions}
                                            inputRef={field.ref}
                                            index={index}
                                        />
                                    )}
                                />
                            </Col>
                            <Col>
                                {accessoryFieldIndex % 2 === 1 && (
                                    <IconButton
                                        size="large"
                                        color="error"
                                        aria-label="deleteAccessory"
                                        onClick={() => handleRemoveAccessoryField(index)}
                                    >
                                        <HighlightOff fontSize="inherit" />
                                    </IconButton>
                                )}
                            </Col>
                        </Fragment>
                    )),
                )}
            </>
        );
    };

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
            onAlert("אין אפשרות לבחור מכשירים שלא מאותה יחידה או לבחור צל\"ם או צ' ביחד", error, true);
        }
    };
    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
    };
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
                    <>
                        <Row gutter={[10, 10]}>{combinedFields()}</Row>
                        <Box textAlign="center" marginTop={1}>
                            <Space>
                                <CustomButton type="light-success" iconPosition="end" onClick={handleAddDevice} icon={<PlusOutlined />}>
                                    הוסף מכשיר
                                </CustomButton>
                                <CustomButton type="light-success" iconPosition="end" onClick={handleAddAccessory} icon={<PlusOutlined />}>
                                    הוסף צל&quot;ם
                                </CustomButton>
                            </Space>
                        </Box>
                    </>
                )}
                {isDeliveryVoucher && (
                    <DevicesInProjectTable
                        isLoading={isLoading}
                        filteredDevices={filteredDevices}
                        selectedStatus={FIXED_OR_DEFFECTIVE}
                        rowSelection={rowSelection}
                        defaultPageSize={25}
                    />
                )}
            </Box>
        </>
    );
};

export default VoucherStep2;
