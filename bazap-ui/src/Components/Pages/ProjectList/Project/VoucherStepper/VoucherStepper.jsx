import { Box, Step, StepLabel, Stepper } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewDevices, getDeviceBySerialNumber, returnDevice } from "../../../../../Utils/deviceApi";
import { addVoucher } from "../../../../../Utils/voucherApi";
import { useUserAlert } from "../../../../store/UserAlertContext";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { Button, Divider, Flex, Form, Space } from "antd";
import Loader from "../../../../Layout/Loader";

const VoucherStepper = ({ onCancel, projectId }) => {
    const [form] = Form.useForm();
    const { onAlert, error } = useUserAlert();
    const [activeStep, setActiveStep] = useState(1);
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ devices: [{ serialNumber: "", deviceType: undefined }] });

    const steps = [
        { title: "יצירת שובר", content: <Step1 formData={formData} form={form} /> },
        { title: "הוספת מכשירים", content: <Step2 formData={formData} form={form} /> },
    ];

    const stepperCancel = () => {
        onCancel();
        setTimeout(() => {
            //reset
            setActiveStep(0);
        }, 200);
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
    const addNewDevicesMutation = useMutation(addNewDevices, {
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
        onSuccess: (data) => {
            const voucherId = data.data.id;
            // const voucherData = getValues();
            const voucherData = null;
            const isReturnVoucher = voucherData.type == "false";
            if (isReturnVoucher) {
                const devices = voucherData.devices.map((device) => device.serialNumber);
                returnDevicesMutation.mutate({ devices, voucherId });
            } else {
                const devices = voucherData.devices.map((device) => ({
                    serialNumber: device.serialNumber,
                    type: device.deviceType,
                    voucherId: voucherId,
                    unitId: voucherData.unit,
                }));
                addNewDevicesMutation.mutate(devices);
            }
            stepperCancel();
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSave = (data) => {
        if (activeStep != steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        }
        if (activeStep == steps.length - 1) {
            stepperCancel();
        }
    };
    const getDeviceBySerialNumberMutation = useMutation(getDeviceBySerialNumber, {
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const fieldChange = async (changedValues, allValues) => {
        // let updatedValues = allValues;
        // if ("devices" in changedValues) {
        //     const serialNumber = changedValues["devices"].serialNumber;
        //     const deviceType = changedValues["devices"].deviceType;
        //     if (deviceType === "") {
        //         const data = await getDeviceBySerialNumberMutation.mutateAsync(serialNumber);
        //         if (!data.message) {
        //             const updatedDevices = allValues.devices.map((device) => {
        //                 if (device.serialNumber === serialNumber) {
        //                     return { ...device, deviceType: data.deviceType };
        //                 }
        //                 return device;
        //             });
        //             updatedValues = { ...allValues, devices: updatedDevices };
        //         }
        //     }
        // }
        setFormData(allValues);
    };
    const isFormIsLoading = false;
    const isLoading = false;
    const submitButtonText = activeStep == steps.length - 1 ? "שמור" : "הבא";
    const isEdit = false;
    return (
        <>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>{step.title}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Divider />
            <Box p={2} mt={1}>
                <Form
                    size="large"
                    form={form}
                    initialValues={formData}
                    onValuesChange={fieldChange}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Box paddingX="2px" paddingY="10px">
                        {isFormIsLoading && <Loader />}
                        {!isFormIsLoading && steps[activeStep].content}
                    </Box>
                    <Divider />
                    <Form.Item>
                        <Flex justify="flex-end" align="center">
                            <Space>
                                <Button onClick={stepperCancel} style={{ marginLeft: 8 }}>
                                    בטל
                                </Button>
                                <Button onClick={handleBack} disabled={activeStep == 0}>
                                    חזור
                                </Button>
                                {!isFormIsLoading && (
                                    <Button type="primary" htmlType="submit" loading={isLoading}>
                                        {submitButtonText ? submitButtonText : isEdit ? "עדכן" : "הוסף"}
                                    </Button>
                                )}
                            </Space>
                        </Flex>
                    </Form.Item>
                </Form>
            </Box>
        </>
    );
};
VoucherStepper.propTypes = {
    onCancel: PropTypes.func.isRequired,
    formDefaultValues: PropTypes.object,
    projectId: PropTypes.string.isRequired,
};

export default VoucherStepper;
