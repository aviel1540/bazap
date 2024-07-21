import { useState } from "react";
import { Tooltip, Modal, Form, Input } from "antd";
import { useAdminAuth } from "../../store/AdminAuthContext";
import CustomButton from "../../UI/CustomButton/CustomButton";
import { CheckOutlined, LoginOutlined } from "@ant-design/icons";

const AdminAuth = () => {
    const { isAuth, onLogin, onLogout } = useAdminAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const loginHandler = () => {
        setIsModalVisible(true);
    };

    const logoutHandler = () => {
        onLogout();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const result = onLogin(values.password);
            if (result) {
                setIsModalVisible(false);
                form.resetFields();
            } else {
                form.setFields([
                    {
                        name: "password",
                        errors: ["סיסמאת מנהל שגויה!"],
                    },
                ]);
            }
        });
    };

    return (
        <div className="fw-500">
            {isAuth && (
                <Tooltip title="לחץ להתנתק" color="blue">
                    <CustomButton type="success" onClick={logoutHandler} iconPosition="end" icon={<CheckOutlined />} size="small">
                        מחובר כמנהל
                    </CustomButton>
                </Tooltip>
            )}
            {!isAuth && (
                <>
                    <Tooltip title="לחץ להתחבר" color="blue">
                        <CustomButton type="dark" onClick={loginHandler} iconPosition="end" icon={<LoginOutlined />} size="small">
                            לא מחובר כמנהל
                        </CustomButton>
                    </Tooltip>
                    <Modal
                        title="התחבר כמנהל"
                        open={isModalVisible}
                        okText="אישור"
                        cancelText="בטל"
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item name="password" label="סיסמא" rules={[{ required: true, message: "יש להזין סיסמא." }]}>
                                <Input.Password />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default AdminAuth;
