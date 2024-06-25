import { Box, Divider, Step, StepLabel, Stepper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
import VoucherStep1 from "./VoucherStep1";
import VoucherStep2 from "./VoucherStep2";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addVoucherIn, addVoucherOut, exportVoucherToExcel } from "../../../../Utils/voucherApi";
import { useProject } from "../../../../Components/store/ProjectContext";
import { Button, Flex, Space } from "antd";

const stepsLength = 2;
const VoucherStepper = ({ onCancel, formDefaultValues }) => {
    const [activeStep, setActiveStep] = useState(0);
    const queryClient = useQueryClient();
    const { projectId } = useProject();
    const methods = useForm({
        defaultValues: {
            projectId,
            devicesData: [],
            accessoriesData: [],
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
                    addVoucherOutMutation.mutate(getValues());
                } else {
                    let values = getValues();
                    values.accessoriesData = values.accessoriesData.map((item) => {
                        if (item.deviceTypeId && typeof item.deviceTypeId === "object" && item.deviceTypeId.value) {
                            return {
                                ...item,
                                deviceTypeId: item.deviceTypeId.value,
                            };
                        }
                        return item;
                    });
                    addVoucherMutation.mutate(values);
                }
            } else {
                setActiveStep((prevStep) => prevStep + 1);
            }
        }
    };
    const exportVoucherMutation = useMutation(exportVoucherToExcel, {});
    const addVoucherOutMutation = useMutation(addVoucherOut, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            queryClient.invalidateQueries(["projects"]);
            queryClient.invalidateQueries(["project", projectId]);
            exportVoucherMutation.mutate(data.newVoucher._id);
            onCancel();
        },
    });

    const addVoucherMutation = useMutation(addVoucherIn, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vouchers", projectId] });
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            queryClient.invalidateQueries(["project", projectId]);
            queryClient.invalidateQueries(["projects"]);
            onCancel();
        },
    });
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };
    const isLoading = addVoucherOutMutation.isLoading || addVoucherMutation.isLoading;
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
                        <Button onClick={onCancel}>בטל</Button>
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
