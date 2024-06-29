import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import CustomButton from "./CustomButton/CustomButton";

const CustomDropDown = ({ actions, data }) => {
    const onClick = (key, data) => {
        const action = actions.find((action) => action.key == key);
        if (action) action.handler(data);
    };
    // eslint-disable-next-line no-unused-vars
    const items = actions.map(({ handler, ...rest }) => rest);
    return (
        <Dropdown
            menu={{
                items,
                onClick: (key) => onClick(key.key, data),
            }}
        >
            <CustomButton onClick={(e) => e.preventDefault()} size="small" type="light-primary">
                <Space>
                    פעולות
                    <DownOutlined />
                </Space>
            </CustomButton>
        </Dropdown>
    );
};
CustomDropDown.propTypes = {
    actions: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
};
export default CustomDropDown;
