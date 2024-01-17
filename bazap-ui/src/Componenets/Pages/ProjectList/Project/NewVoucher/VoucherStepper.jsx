import { Box, Button, Divider, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import LightButton from "../../../../UI/LightButton";
import PropTypes from "prop-types";
import VoucherStep1 from "./VoucherStep1";
import VoucherStep2 from "./VoucherStep2";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../../store/AlertContext";
import { addNewDevices } from "../../../../../Utils/deviceApi";
import { addVoucher } from "../../../../../Utils/voucherApi";

const VoucherStepper = ({ onCancel, projectId }) => {
    const { onAlert } = useAlert();
    const [activeStep, setActiveStep] = useState(0);
    const queryClient = useQueryClient();

    const methods = useForm({
        defaultValues: {
            projectId,
            devices: [{ serialNumber: "", deviceType: "" }],
        },
    });
    const { handleSubmit, formState, setError, clearErrors, getValues } = methods;
    const { isSubmitting, isDirty } = formState;
    const titles = ["יצירת שובר", "הוספת מכשירים"];
    const steps = [<VoucherStep1 key={1} getValues={getValues} />, <VoucherStep2 key={2} getValues={getValues} />];
    const handleNext = async () => {
        const result = await handleSubmit(() => {})(methods.getValues());
        if (result) {
            setError(Object.keys(result)[0], {
                type: "manual",
                message: result[Object.keys(result)[0]].message,
            });
        } else {
            clearErrors();
            if (activeStep == steps.length - 1) {
                handleSave();
                // onCancel();
            } else {
                setActiveStep((prevStep) => prevStep + 1);
            }
        }
    };
    const addNewDevicesMutation = useMutation(addNewDevices, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
        },
        onError: (message) => {
            onAlert(message.message);
        },
    });
    const addVoucherMutation = useMutation(addVoucher, {
        onSuccess: (data) => {
            const voucherId = data.data.id;
            const voucherData = getValues();
            const devices = voucherData.devices.map((device) => ({
                serialNumber: device.serialNumber,
                type: device.deviceType,
                voucherId: voucherId,
                unitId: voucherData.unit,
            }));

            addNewDevicesMutation.mutate(devices);
        },
        onError: (message) => {
            onAlert(message.message);
        },
    });
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSave = () => {
        const voucherData = getValues();
        addVoucherMutation.mutate(voucherData);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleNext)}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {titles.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box p={2} mt={1}>
                    {steps[activeStep]}
                </Box>
                <Divider variant="fullWidth" sx={{ paddingTop: 2 }} />
                <Stack spacing={2} direction="row" marginTop={2}>
                    <LightButton size="small" btncolor="dark" onClick={onCancel} variant="contained">
                        בטל
                    </LightButton>
                    <Button disabled={activeStep === 0} size="small" onClick={handleBack}>
                        חזור
                    </Button>
                    <Button type="submit" size="small" variant="contained" color="primary" disabled={isSubmitting || !isDirty}>
                        {activeStep === steps.length - 1 ? "שמור" : "הבא"}
                    </Button>
                </Stack>
            </form>
        </FormProvider>
    );
};
VoucherStepper.propTypes = {
    onCancel: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
};

export default VoucherStepper;
