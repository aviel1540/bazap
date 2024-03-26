import { Box, Button, IconButton, createFilterOptions } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../../../Utils/deviceTypeApi";
import Loader from "../../../../Layout/Loader";
import HighlightOff from "@mui/icons-material/HighlightOff";
import Add from "@mui/icons-material/Add";
import { replaceApostrophe } from "../../../../../Utils/utils";
import { getDeviceBySerialNumber, getDevices } from "../../../../../Utils/deviceApi";
import ImportExcel from "./ImportExcel";
import { useUserAlert } from "../../../../store/UserAlertContext";
import { Col, Row } from "antd";
import { Fragment, useState } from "react";
import ControlledInput from "../../../../UI/CustomForm/ControlledInput";
const filter = createFilterOptions();

const convertDeivcesToACOptions = (data) => {
    return data.map((device) => {
        return { text: device.serialNumber };
    });
};

const VoucherStep2 = () => {
    const [disabledFields, setDisabledFields] = useState({});
    const { onAlert, error } = useUserAlert();
    const { getValues, control, setValue } = useFormContext();
    const isDeliveryVoucher = getValues("type") == "false";
    const { isLoading: isLoadingArrivedDevices, data: allDevicesAutoCompleteOptions } = useQuery({
        queryKey: ["allDevicesAutoCompleteOptions"],
        queryFn: async () => {
            const alldevices = await getDevices();
            return convertDeivcesToACOptions(alldevices);
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
    const isLoading = isLoadingDevicesTypes || isLoadingArrivedDevices;
    const { fields, append, remove } = useFieldArray({
        rules: { minLength: 1 },
        control,
        name: "devices",
    });
    const handleAddFields = () => {
        append({ serialNumber: "", deviceType: "" });
    };

    const onFilterOptions = (options, params) => {
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
    const onGetOptionLabel = (option) => {
        if (typeof option === "string") {
            return option;
        }
        return option.text;
    };

    const devicesToDisplay = isDeliveryVoucher ? [] : allDevicesAutoCompleteOptions;

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

    const validateSerialNumber = (value, formValues) => {
        // validate serial number doesn't exist in the same voucher
        const foundedDevices = formValues.devices.filter((device) => device.serialNumber === value);
        if (foundedDevices.length > 1) return "צ' מכשיר לא יכול להופיע פעמיים.";
        // need to add validation that serial numbe
        return true;
    };

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
            options: devicesToDisplay,
            getOptionLabel: onGetOptionLabel,
            filterOptions: onFilterOptions,
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
    const combinedFields = fields.map((field, index) =>
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
                                getOptionLabel={onGetOptionLabel}
                                filterOptions={onFilterOptions}
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

    if (isLoading) {
        return <Loader />;
    }
    return (
        <>
            <ImportExcel fields={fields} getValues={getValues} append={append} remove={remove} setDisabledFields={setDisabledFields} />
            <Box padding={2}>
                <Row gutter={[10, 10]}>{combinedFields}</Row>
            </Box>
            <Box textAlign="center" marginTop={1}>
                <Button type="button" onClick={handleAddFields} variant="contained" color="success" endIcon={<Add />}>
                    הוסף מכשיר
                </Button>
            </Box>
        </>
    );
};

export default VoucherStep2;
