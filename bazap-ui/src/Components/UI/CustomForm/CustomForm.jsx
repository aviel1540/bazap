import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
import { Divider, Flex } from "antd";
import RenderFields from "./RenderFields";
import Loader from "../../../Components/Layout/Loader";
import RenderSteps from "./RenderSteps";
import FormButtons from "./FormButtons";
import { useAdminAuth } from "../../store/AdminAuthContext";

const CustomForm = ({ steps, onSubmit, onCancel, values, children, isLoading, isPasswordRequired, fields }) => {
    const methods = useForm({
        defaultValues: values,
        mode: "onChange",
    });
    const { handleSubmit } = methods;
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [validPassword, setValidPassowrd] = useState();
    const [currentStep, setCurrentStep] = useState(1);
    const { isAuth } = useAdminAuth();

    const onSubmitPageWithAdminPassword = (data) => {
        if (!isPasswordRequired) {
            onSubmit(data);
            return;
        }
        if (!open && !isAuth) {
            setOpen(true);
            return;
        }
        if (validPassword || isAuth) {
            onSubmit(data);
        }
    };

    const handlePopupCancel = () => {
        setPassword("");
        setOpen(false);
        setValidPassowrd(undefined);
    };
    const localProps = {
        steps,
        fields,
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
    };

    return (
        <FormProvider methods={{ formMethods: methods, localProps: localProps }}>
            <form onSubmit={handleSubmit(onSubmitPageWithAdminPassword)}>
                {isLoading && <Loader />}
                {!isLoading && (
                    <>
                        <RenderSteps />
                        <RenderFields />
                        {children}
                    </>
                )}
                <Divider />
                <Flex gap="small" align="center" justify="flex-end">
                    <FormButtons />
                </Flex>
            </form>
        </FormProvider>
    );
};

CustomForm.propTypes = {
    steps: PropTypes.array,
    fields: PropTypes.array,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    values: PropTypes.object,
    children: PropTypes.element,
    isLoading: PropTypes.bool,
    isPasswordRequired: PropTypes.bool,
};

export default CustomForm;
