import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { DialogActions } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Button, Input, Popconfirm } from "antd";
import RenderFields from "./RenderFields";
import { useState } from "react";
import { Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { validatePassword } from "../../../Utils/passwordAPI";
import Loader from "../../../Components/Layout/Loader";
const { Text } = Typography;

const CustomForm = ({
    inputs,
    onSubmit,
    onCancel,
    values,
    children,
    isLoading,
    isPasswordRequired = false, // Use default parameter here
}) => {
    const { handleSubmit, reset, control, getValues } = useForm({
        defaultValues: values, // Adjusted to use defaultValues instead of values
        mode: "onChange",
    });
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [validPassword, setValidPassword] = useState();

    const validatePasswordMutation = useMutation(validatePassword, {
        onSuccess: (isValid) => {
            if (isValid) {
                onSubmit(getValues());
                setPassword("");
                setOpen(false);
            } else {
                setValidPassword(false);
            }
        },
        onError: () => {
            setValidPassword(false);
        },
    });

    const handlePasswordSubmit = () => {
        validatePasswordMutation.mutate(password);
    };

    const handlePopupCancel = () => {
        setPassword("");
        setOpen(false);
        setValidPassword(undefined);
    };

    const onSubmitPageWithAdminPassword = (data) => {
        if (!isPasswordRequired) {
            onSubmit(data);
        } else {
            if (!open || validPassword) {
                onSubmit(data);
            }
        }
    };

    const handleCancel = () => {
        onCancel();
        reset();
        setOpen(false);
        setPassword("");
        setValidPassword(undefined);
    };

    return (
        <form onSubmit={handleSubmit(onSubmitPageWithAdminPassword)}>
            {isLoading && <Loader />}
            {!isLoading && (
                <>
                    {inputs && <RenderFields fields={inputs} control={control} />}
                    <Divider variant="fullWidth" sx={{ paddingTop: 2 }} />
                    {children}
                </>
            )}
            <DialogActions>
                <>
                    <Button
                        loading={isLoading}
                        btncolor="dark"
                        onClick={handleCancel}
                        sx={{
                            marginX: {
                                xs: "10px",
                            },
                        }}
                    >
                        בטל
                    </Button>
                    <Popconfirm
                        open={open}
                        title={
                            <>
                                <Input.Password
                                    placeholder="סיסמה"
                                    status={validPassword === false ? "error" : ""}
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
                </>
            </DialogActions>
        </form>
    );
};

CustomForm.propTypes = {
    inputs: PropTypes.array,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    values: PropTypes.object,
    children: PropTypes.element,
    isLoading: PropTypes.bool,
    isPasswordRequired: PropTypes.bool,
};

export default CustomForm;
