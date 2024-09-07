import { Dropdown, Button, Space, Divider } from "antd";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import PropTypes from "prop-types";

const FilterMenu = ({ menuItems, clearAllFilters }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownVisibleChange = (visible) => {
        setIsDropdownOpen(visible);
    };

    const handleClearAll = () => {
        clearAllFilters(); // Call the clearAllFilters function passed via props
        setIsDropdownOpen(false); // Close the dropdown after clearing the filters
    };

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false); // Close the dropdown when the close button is clicked
    };

    return (
        <Space>
            <Dropdown
                placement="bottomLeft"
                trigger={["click"]}
                onOpenChange={handleDropdownVisibleChange}
                open={isDropdownOpen}
                rootClassName="w-350px"
                dropdownRender={() => (
                    <div className="bg-white rounded shadow-sm p-3">
                        <div className="d-flex justify-content-between align-items-center py-2 px-3">
                            <span className="fw-600">אפשרויות סינון</span>
                            <Button type="text" icon={<CloseOutlined />} onClick={handleCloseDropdown} size="small" />
                        </div>
                        <Divider className="my-0" />

                        <Divider className="my-0" />
                        {menuItems.map((item) => (
                            <div key={item.key}>
                                <div className="py-2 px-3" style={{ cursor: "pointer" }}>
                                    {item.label}
                                </div>
                                <Divider className="my-0" />
                            </div>
                        ))}

                        <div className="d-flex justify-content-center mt-2">
                            <Button type="primary" onClick={handleClearAll}>
                                נקה הכל
                            </Button>
                        </div>
                    </div>
                )}
            >
                <Button icon={<FilterOutlined />}>סינון</Button>
            </Dropdown>
        </Space>
    );
};

FilterMenu.propTypes = {
    menuItems: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node.isRequired,
            key: PropTypes.string.isRequired,
        }),
    ).isRequired,
    clearAllFilters: PropTypes.func.isRequired,
};

export default FilterMenu;
