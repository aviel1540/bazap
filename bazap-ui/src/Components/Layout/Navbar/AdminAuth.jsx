import { Fragment } from "react";
import { Tooltip } from "antd";
import { useAdminAuth } from "../../store/AdminAuthContext";
import CustomButton from "../../UI/CustomButton/CustomButton";
import { CheckOutlined, LoginOutlined, InfoCircleOutlined } from "@ant-design/icons";

const AdminAuth = () => {
    const { isAuth, onLogin, onLogout } = useAdminAuth();

    const loginHandler = () => {
        onLogin("admin");
        // setIsModalVisible(true);
    };

    const logoutHandler = () => {
        onLogout();
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {isAuth && (
                <Fragment key="Auth">
                    <Tooltip title="לחץ להתנתק" color="blue">
                        <CustomButton type="success" onClick={logoutHandler} iconPosition="end" icon={<CheckOutlined />} size="small">
                            מחובר כמנהל
                        </CustomButton>
                    </Tooltip>
                </Fragment>
            )}
            {!isAuth && (
                <Fragment key="NotAuth">
                    <Tooltip title="לחץ להתחבר" color="blue">
                        <CustomButton type="dark" onClick={loginHandler} iconPosition="end" icon={<LoginOutlined />} size="small">
                            לא מחובר כמנהל
                        </CustomButton>
                    </Tooltip>
                </Fragment>
            )}
            <Tooltip title="התחברות ל-20 דקות כמנהל תחסוך הכנסת סיסמא כל פעם" color="blue">
                <InfoCircleOutlined className="ms-5 text-white fs-4" />
            </Tooltip>
        </div>
    );
};

export default AdminAuth;
