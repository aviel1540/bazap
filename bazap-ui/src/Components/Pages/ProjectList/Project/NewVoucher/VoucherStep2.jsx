import { Box, Button, IconButton, createFilterOptions } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../../../Utils/deviceTypeApi";
import Loader from "../../../../Layout/Loader";
import HighlightOff from "@mui/icons-material/HighlightOff";
import Add from "@mui/icons-material/Add";
import { replaceApostrophe } from "../../../../../Utils/utils";
import { getAllArrivedDevicesInProject, getDeviceBySerialNumber } from "../../../../../Utils/deviceApi";
import ImportExcel from "./ImportExcel";
import { useUserAlert } from "../../../../store/UserAlertContext";
import { Col, Row } from "antd";
import { Fragment } from "react";
import ControlledInput from "../../../../UI/CustomForm/ControlledInput";
const filter = createFilterOptions();

const VoucherStep2 = () => {
    const { onAlert, error } = useUserAlert();

    const { getValues } = useFormContext();
    const projectId = getValues("projectId");
    const isArrive = getValues("type") == "true";
    const { isLoading: isLoadingArrivedDevices, data: arrivedDevices } = useQuery({
        queryKey: ["devicesInProject", projectId],
        queryFn: getAllArrivedDevicesInProject,
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
    const { control, setValue } = useFormContext();
    const { fields, append, remove } = useFieldArray({
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
        if (isArrive) {
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
    const arrivedDevicesText = arrivedDevices.map((device) => {
        return { text: device.serialNumber };
    });

    const devicesToDisplay = isArrive ? [] : arrivedDevicesText;

    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber, {
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const handleFieldChange = async (serialNumber, index) => {
        if (serialNumber) {
            const data = await getDeviceBySerialNumberMutation.mutateAsync(serialNumber);
            if (!data.message) {
                setValue(`devices[${index}].deviceType`, data.deviceType);
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
            <ImportExcel fields={fields} append={append} remove={remove} />
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
