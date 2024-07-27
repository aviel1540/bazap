import { useMutation } from "@tanstack/react-query";
import { validatePassword } from "../../../Utils/passwordAPI";
import { useFormContext } from "react-hook-form";
import { Button, Input, Popconfirm, Typography } from "antd";
const { Text } = Typography;

const FormButtons = () => {
    const { methods } = useFormContext();
    const { formMethods, localProps } = methods;
    const { trigger, reset, getValues } = formMethods;
    const {
        steps,
        currentStep,
        open,
        onSubmit,
        isLoading,
        password,
        validPassword,
        onCancel,
        setCurrentStep,
        setOpen,
        setPassword,
        setValidPassowrd,
        handlePopupCancel,
    } = localProps;

    const handleNext = async () => {
        const isValid = await trigger();
        if (isValid && currentStep < steps.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    const handleCancel = () => {
        onCancel();
        reset();
        setOpen(false);
        setPassword("");
        setValidPassowrd(undefined);
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };
    const validatePasswordMutation = useMutation(validatePassword, {
        onSuccess: (isValid) => {
            if (isValid) {
                onSubmit(getValues());
                setPassword("");
                setOpen(false);
            } else {
                setValidPassowrd(false);
            }
        },
        onError: () => {
            setValidPassowrd(false);
        },
    });

    const handlePasswordSubmit = () => {
        validatePasswordMutation.mutate(password);
    };

    return (
        <>
            <Button onClick={handleCancel} disabled={isLoading}>
                בטל
            </Button>
            {steps && steps.length > 1 && (
                <Button onClick={handleBack} disabled={isLoading || currentStep == 0}>
                    הקודם
                </Button>
            )}
            {steps && currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={handleNext} disabled={isLoading}>
                    הבא
                </Button>
            ) : (
                <Popconfirm
                    open={open}
                    title={
                        <>
                            <Input.Password
                                placeholder="סיסמה"
                                status={validPassword === false && "error"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {validPassword === false && <Text type="danger">סיסמת מנהל לא נכונה.</Text>}
                        </>
                    }
                    onConfirm={handlePasswordSubmit}
                    onCancel={handlePopupCancel}
                    okText="אישור"
                    cancelText="בטל"
                >
                    <Button loading={isLoading} htmlType="submit" type="primary">
                        שמור
                    </Button>
                </Popconfirm>
            )}
        </>
    );
};

export default FormButtons;

// {
//     steps && steps.length > 1 && (
//         <Button onClick={handleBack} disabled={isLoading || currentStep == 0}>
//             הקודם
//         </Button>
//     );
// }
// {
//     steps && currentStep < steps.length - 1 ? (
//         <Button onClick={handleNext} disabled={isLoading}>
//             הבא
//         </Button>
//     ) : (
//         <Popconfirm
//             open={open}
//             title={
//                 <>
//                     {/* <Input.Password
//                     placeholder="סיסמה"
//                     status={validPassword === false && "error"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 /> */}
//                     {validPassword === false && <Text type="danger">סיסמת מנהל לא נכונה.</Text>}
//                 </>
//             }
//             onConfirm={handlePasswordSubmit}
//             onCancel={handlePopupCancel}
//             okText="אישור"
//             cancelText="בטל"
//         >
//             <Button loading={isLoading} htmlType="submit" type="primary">
//                 שמור
//             </Button>
//         </Popconfirm>
//     );
// }
