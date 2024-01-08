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
const filter = createFilterOptions();

const VoucherStep2 = () => {
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: async () => {
            const deviceTypesData = await getAllDeviceTypes();
            const newArray = deviceTypesData.map((dType) => {
                const formattedName = dType.deviceName.replace(/&#39;/g, "'");
                return { text: formattedName, value: formattedName, ...dType };
            });
            return newArray;
        },
    });
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
        if (inputValue !== "" && !isExisting) {
            filtered.push({
                inputValue,
                text: `הוסף צ' "${inputValue}"`,
            });
        }

        return filtered;
    };
    const onGetOptionLabel = (option) => {
        if (typeof option === "string") {
            return option;
        }
        return option.text;
    };
    const voucherInputs = [
        {
            label: "צ' מכשיר",
            name: "serialNumber",
            type: "AutoComplete",
            isNumber: true,
            validators: {
                required: "יש למלא שדה זה.",
            },
            options: [{ text: "555" }, { text: "1533" }],
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
