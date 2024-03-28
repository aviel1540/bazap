import { Box, Button, IconButton, createFilterOptions } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../../../Utils/deviceTypeApi";
import HighlightOff from "@mui/icons-material/HighlightOff";
import Add from "@mui/icons-material/Add";
import { DeviceStatuses, FIXED_OR_DEFFECTIVE, replaceApostrophe } from "../../../../../Utils/utils";
import { getAllArrivedDevicesInProject, getDeviceBySerialNumber, getDevices } from "../../../../../Utils/deviceApi";
import ImportExcel from "./ImportExcel";
import { useUserAlert } from "../../../../store/UserAlertContext";
import { Col, Row } from "antd";
import { Fragment, useEffect, useState } from "react";
import ControlledInput from "../../../../UI/CustomForm/ControlledInput";
import { useProject } from "../../../../store/ProjectContext";
import DevicesInProjectTable from "../DevicesInProject/DevicesInProjectTable";
import { checkDuplicationInForm } from "../../../../../Utils/formUtils";
import Loader from "../../../../Layout/Loader";
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
    const [disabledFields, setDisabledFields] = useState({});
    const { onAlert, error } = useUserAlert();
    const { projectId } = useProject();
    const { getValues, control, setValue } = useFormContext();
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const isDeliveryVoucher = getValues("type") == "false";
    const { isLoading: isLoadingArrivedDevices, data: allDevices } = useQuery({
        queryKey: ["allDevices"],
        queryFn: getDevices,
    });

    const { isLoading: isLaodingDevicesInProject, refetch } = useQuery({
        queryKey: ["fixedOrReturnedDevicesInProject", projectId],
        queryFn: getAllArrivedDevicesInProject,
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
        queryFn: async () => {
            const deviceTypesData = await getAllDeviceTypes();
            const newArray = deviceTypesData.map((dType) => {
                const formattedName = replaceApostrophe(dType.deviceName);
                return { text: formattedName, value: formattedName, ...dType };
            });
            return newArray;
        },
    });
    useEffect(() => {
        if (isDeliveryVoucher) {
            refetch();
            const selectedIds = getValues().devicesIds;
            setSelectedRowKeys(selectedIds);
        }
    }, [isDeliveryVoucher]);

    const isLoading = isLoadingDevicesTypes || isLoadingArrivedDevices || (isDeliveryVoucher && isLaodingDevicesInProject);

    const { fields, append, remove } = useFieldArray({
        rules: { minLength: 1 },
        control,
        name: "devices",
    });

    const handleAddFields = () => {
        append({ serialNumber: "", deviceType: "" });
    };

    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber, {
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
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

    const combinedFields = () => {
        const voucherInputs = [
            {
                label: "צ' מכשיר",
                name: "serialNumber",
                type: "AutoComplete",
                isNumber: true,
                validators: {
                    required: "יש למלא שדה זה.",
                    minLength: { value: 6, message: "צ' מכשיר צריך לפחות 5 תווים" },
                    validate: validateSerialNumber,
                },
                options: isDeliveryVoucher ? [] : convertDeivcesToACOptions(allDevices),
                getOptionLabel: onGetOptionLabel,
                filterOptions: (options, params) => onFilterOptions(options, params, isDeliveryVoucher, filter),
                onFieldChange: handleFieldChange,
            },
            {
                label: "סוג מכשיר",
                name: "deviceType",
                type: "select",
                validators: {
                    required: "יש למלא שדה זה.",
                },
                options: deviceTypes,
            },
        ];

        const handleRemoveFields = (index) => {
            remove(index);
            setDisabledFields((prev) => {
                const updatedState = { ...prev };
                delete updatedState[index];
                return updatedState;
            });
        };
        return fields.map((field, index) =>
            voucherInputs.map((input, deviceFieldIndex) => (
                <Fragment key={`${field.id}.${index}.${deviceFieldIndex}`}>
                    <Col span={11}>
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
                        {deviceFieldIndex % 2 === 1 && index != 0 && (
                            <IconButton size="large" color="error" aria-label="deleteDevice" onClick={() => handleRemoveFields(index)}>
                                <HighlightOff fontSize="inherit" />
                            </IconButton>
                        )}
                    </Col>
                </Fragment>
            )),
        );
    };
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setValue("devicesIds", newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    return (
        <>
            <ImportExcel
                fields={fields}
                getValues={getValues}
                append={append}
                remove={remove}
                setDisabledFields={setDisabledFields}
                isDeliveryVoucher={isDeliveryVoucher}
                setSelectedRowKeys={setSelectedRowKeys}
            />
            <Box padding={2}>
                {isLoading && <Loader />}

                {!isLoading && !isDeliveryVoucher && (
                    <>
                        <Row gutter={[10, 10]}>{combinedFields()}</Row>
                        <Box textAlign="center" marginTop={1}>
                            <Button type="button" onClick={handleAddFields} variant="contained" color="success" endIcon={<Add />}>
                                הוסף מכשיר
                            </Button>
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
