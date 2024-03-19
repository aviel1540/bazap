import { Box, Button, IconButton, createFilterOptions } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import ControllerInput from "../../../../UI/CustomForm/ControlledInput";
import { useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../../../Utils/deviceTypeApi";
import Loader from "../../../../Layout/Loader";
import Grid from "@mui/material/Unstable_Grid2";
import HighlightOff from "@mui/icons-material/HighlightOff";
import Add from "@mui/icons-material/Add";
import { Fragment } from "react";
import { replaceApostrophe } from "../../../../../Utils/utils";
import { getAllArrivedDevicesInProject } from "../../../../../Utils/deviceApi";
import ImportExcel from "./ImportExcel";

const filter = createFilterOptions();

const VoucherStep2 = () => {
    const { getValues } = useFormContext();
    const projectId = getValues("projectId");
    const isArrive = getValues("type") == "true";
    const { isLoading: isLoadingArrivedDevices, data: arrivedDevices } = useQuery({
        queryKey: ["arrivedDevices", projectId],
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
    const { control } = useFormContext();
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
    const voucherInputs = [
        {
            label: "צ' מכשיר",
            name: "serialNumber",
            type: "AutoComplete",
            isNumber: true,
            validators: {
                required: "יש למלא שדה זה.",
            },
            options: devicesToDisplay,
            getOptionLabel: onGetOptionLabel,
            filterOptions: onFilterOptions,
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
    const combinedFields = fields.map((field, index) => (
        <Grid key={field.id} container spacing={2}>
            {voucherInputs.map((input, deviceFieldIndex) => (
                <Fragment key={input.name}>
                    <Grid item="true" xs={5}>
                        <Controller
                            name={`devices[${index}].${input.name}`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <ControllerInput
                                    {...field}
                                    label={input.label}
                                    type={input.type}
                                    isNumber={input.isNumber}
                                    validators={input.validators}
                                    options={input.options}
                                    getOptionLabel={onGetOptionLabel}
                                    filterOptions={onFilterOptions}
                                    ref={field.ref}
                                />
                            )}
                        />
                    </Grid>
                    {deviceFieldIndex % 2 === 1 && index != 0 && (
                        <Grid alignItems="center" display="flex" justifyContent="center" item="true" xs={1}>
                            <IconButton size="large" color="error" aria-label="deleteDevice" onClick={() => handleRemoveFields(index)}>
                                <HighlightOff fontSize="inherit" />
                            </IconButton>
                        </Grid>
                    )}
                </Fragment>
            ))}
        </Grid>
    ));
    if (isLoading) {
        return <Loader />;
    }
    return (
        <>
            <ImportExcel fields={fields} append={append} remove={remove} />
            <Box padding={2}>{combinedFields}</Box>
            <Box textAlign="center" marginTop={1}>
                <Button type="button" onClick={handleAddFields} variant="contained" color="success" endIcon={<Add />}>
                    הוסף מכשיר
                </Button>
            </Box>
        </>
    );
};

export default VoucherStep2;
