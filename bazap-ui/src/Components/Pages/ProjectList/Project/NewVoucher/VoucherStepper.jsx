import { Box, Divider, Step, StepLabel, Stepper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
import VoucherStep1 from "./VoucherStep1";
import VoucherStep2 from "./VoucherStep2";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { returnDevice } from "../../../../../Utils/deviceApi";
import { addVoucher } from "../../../../../Utils/voucherApi";
import { useUserAlert } from "../../../../store/UserAlertContext";
import { useProject } from "../../../../store/ProjectContext";
import { Button, Flex, Space } from "antd";

const stepsLength = 2;
const VoucherStepper = ({ onCancel, formDefaultValues }) => {
    const { onAlert, error } = useUserAlert();
    const [activeStep, setActiveStep] = useState(0);
    const queryClient = useQueryClient();
    const { projectId } = useProject();
    const methods = useForm({
        defaultValues: {
            projectId,
            devices: [{ serialNumber: "", deviceType: "" }],
            ...formDefaultValues,
        },
    });
    const { handleSubmit, setError, clearErrors, getValues } = methods;

    const steps = [
        { title: "יצירת שובר", content: <VoucherStep1 /> },
        { title: "הוספת מכשירים", content: <VoucherStep2 /> },
    ];

    const handleNext = async () => {
        const result = await handleSubmit(() => {})(getValues());
        if (result) {
            setError(Object.keys(result)[0], {
                type: "manual",
                message: result[Object.keys(result)[0]].message,
            });
        } else {
            clearErrors();
            if (activeStep == stepsLength - 1) {
                const isDeliveryVoucher = getValues("type") == "false";
                if (isDeliveryVoucher) {
                    returnDevicesMutation.mutate(getValues());
                } else {
                    addVoucherMutation.mutate(getValues());
                }
            } else {
                setActiveStep((prevStep) => prevStep + 1);
            }
        }
    };
    const returnDevicesMutation = useMutation(returnDevice, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            queryClient.invalidateQueries(["project", projectId]);
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });

    const addVoucherMutation = useMutation(addVoucher, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            queryClient.invalidateQueries(["project", projectId]);
            onCancel();
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };
    const isLoading = returnDevicesMutation.isLoading || addVoucherMutation.isLoading;
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleNext)}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepLabel>{step.title}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box p={2} mt={1}>
                    {steps[activeStep].content}
                </Box>
                <Divider />
                <Flex justify="flex-end" style={{ padding: "8px" }} salign="center">
                    <Space>
                        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                            בטל
                        </Button>
                        <Button onClick={handleBack} disabled={activeStep == 0}>
                            חזור
                        </Button>
                        {!isLoading && (
                            <Button type="primary" htmlType="submit">
                                {activeStep === stepsLength - 1 ? "שמור" : "הבא"}
                            </Button>
                        )}
                    </Space>
                </Flex>
            </form>
        </FormProvider>
    );
};
VoucherStepper.propTypes = {
    onCancel: PropTypes.func.isRequired,
    formDefaultValues: PropTypes.object,
};

export default VoucherStepper;
