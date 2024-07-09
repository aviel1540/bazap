import React from "react";
import { Tag, Tooltip } from "antd";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

const AdminAuth = () => {
    const onLogin = () => {};
    const onLogOut = () => {};
    return (
        <div className="fw-500">
            <Tooltip title="לחץ להתנתק" color="blue">
                <Tag icon={<CheckCircleOutlined />} onClick={onLogOut} color="success">
                    מחובר כמנהל
                </Tag>
            </Tooltip>
            <Tooltip title="לחץ להתחבר" onLogOut={onLogin} color="blue">
                <Tag color="default">לא מחובר כמנהל</Tag>
            </Tooltip>
            <Tooltip title="לאחר התחברות כמנהל, לא תידרש להכניס את סיסמת המנהל במשך 20 הדקות הבאות." color="blue">
                <InfoCircleOutlined className="fs-5 text-primary" />
            </Tooltip>
        </div>
    );
};

export default AdminAuth;
