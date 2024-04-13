import React, { useState } from "react";
import { Popconfirm, Input, Typography } from "antd";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import { validatePassword } from "../../Utils/passwordAPI";

const { Text } = Typography;

const ConfirmWithPasswordPopconfirm = ({ children, onConfirm }) => {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(true);

    const validatePasswordMutation = useMutation(validatePassword, {
        onSuccess: (isValid) => {
            if (isValid == true) {
                onConfirm();
                setOpen(false);
                setPassword("");
                setValidPassword(true);
            }
            setValidPassword(isValid);
        },
        onError: () => {
            setValidPassword(false);
        },
    });

    const handlePasswordSubmit = () => {
        validatePasswordMutation.mutate(password);
    };

    const handlePopupCancel = () => {
        setOpen(false);
        setPassword("");
        setValidPassword(true);
    };

    const trigger = React.Children.map(children, (child) => React.cloneElement(child, { onClick: () => setOpen(true) }));
    return (
        <div style={{ width: "100%" }}>
            <Popconfirm
                open={open}
                title={
                    <>
                        <Input.Password
                            placeholder="סיסמה"
                            status={!validPassword && "error"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {!validPassword && <Text type="danger">סיסמת מנהל לא נכונה.</Text>}
                    </>
                }
                onConfirm={handlePasswordSubmit}
                onCancel={handlePopupCancel}
                okText="אישור"
                cancelText="בטל"
            >
                {trigger}
            </Popconfirm>
        </div>
    );
};

ConfirmWithPasswordPopconfirm.propTypes = {
    onConfirm: PropTypes.func,
    children: PropTypes.node,
};

export default ConfirmWithPasswordPopconfirm;
