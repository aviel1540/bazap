import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import CustomButton from "./CustomButton/CustomButton";
import { useAdminAuth } from "../store/AdminAuthContext";

const CustomDropDown = ({ actions, data }) => {
    const { onLogin, isAuth } = useAdminAuth();

    const onClick = (key, data) => {
        const action = actions.find(function (action) {
            return action.key === key;
        });

        if (isAuth == false && action && action.isPasswordRequired) {
            onLogin("validate")
                .then((isValid) => {
                    if (isValid) {
                        action.handler(data);
                    }
                })
                .catch((error) => {
                    console.error("Password validation failed:", error);
                });
        } else if (action) {
            action.handler(data);
        }
    };

    const items = actions.map(function (action) {
        const rest = {};
        for (let key in action) {
            if (key !== "handler" && key !== "isPasswordRequired") {
                rest[key] = action[key];
            }
        }
        return rest;
    });

    return (
        <Dropdown
            menu={{
                items: items,
                onClick: function (key) {
                    onClick(key.key, data);
                },
            }}
        >
            <CustomButton size="small" type="light-primary">
                <Space>
                    פעולות
                    <DownOutlined />
                </Space>
            </CustomButton>
        </Dropdown>
    );
};

CustomDropDown.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            isPasswordRequired: PropTypes.bool,
            handler: PropTypes.func.isRequired,
        }),
    ).isRequired,
    data: PropTypes.object.isRequired,
};

export default CustomDropDown;
