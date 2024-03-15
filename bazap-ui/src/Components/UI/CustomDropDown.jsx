import { Button, Dropdown, Space } from "antd";
import React from "react";
import { DownOutlined } from "@ant-design/icons";

const CustomDropDown = ({ actions, data }) => {
    const onClick = (key, data) => {
        const action = actions.find((action) => action.key == key);
        if (action) action.handler(data);
    };
    const items = actions.map(({ handler, ...rest }) => rest);
    return (
        <Dropdown
            menu={{
                items,
                onClick: (key) => onClick(key.key, data),
            }}
        >
            <Button onClick={(e) => e.preventDefault()}>
                <Space>
                    פעולות
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
    );
};

export default CustomDropDown;
