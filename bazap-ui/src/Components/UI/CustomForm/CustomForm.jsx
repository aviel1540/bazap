import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { DialogActions } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Button, Input, Popconfirm } from "antd";
import RenderFields from "./RenderFields";
import Loader from "../../Layout/Loader";
import { useState } from "react";
import { Typography } from "antd";

const { Text } = Typography;

const CustomForm = ({ inputs, onSubmit, onCancel, values, hideActions, children, isLoading, isPasswordRequired }) => {
    const { handleSubmit, reset, control } = useForm({
        values,
        mode: "onChange",
    });
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [validPassword, setValidPassowrd] = useState();
    const handlePasswordSubmit = () => {
        // const validate valid password
        setValidPassowrd(false);

        // setPassword("");
        // setOpen(false);
        // onSubmit(getValues());
    };

    const handlePopupCancel = () => {
        setPassword("");
        setOpen(false);
        setValidPassowrd(undefined);
    };

    const onSubmitPageWithAdminPassword = (data) => {
        if (!isPasswordRequired) {
            onSubmit(data);
        } else {
            if (open == false) {
                setOpen(true);
            } else {
                if (validPassword) {
                    onSubmit(data);
                }
            }
        }
    };
    const handleCancel = () => {
        onCancel();
        reset();
        setOpen(false);
        setPassword("");
        setValidPassowrd(undefined);
    };
    return (
        <form onSubmit={handleSubmit(onSubmitPageWithAdminPassword)}>
            {isLoading && <Loader />}
            {!isLoading && (
                <>
                    <RenderFields fields={inputs} control={control} />
                    <Divider variant="fullWidth" sx={{ paddingTop: 2 }} />
                </>
            )}
            <DialogActions>
                {hideActions == false && (
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
                                        status={validPassword == false && "error"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {validPassword == false && <Text type="danger">סיסמת מנהל לא נכונה.</Text>}{" "}
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
                )}
                {hideActions == false && children && { children }}
            </DialogActions>
        </form>
    );
};
CustomForm.propTypes = {
    inputs: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    values: PropTypes.object,
    hideActions: PropTypes.bool,
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    isPasswordRequired: PropTypes.bool,
};
CustomForm.defaultProps = {
    hideActions: false,
    isPasswordRequired: false,
};
export default CustomForm;
