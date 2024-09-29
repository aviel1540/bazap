import { Dropdown, Button, Space, Divider, Select, DatePicker, Switch, Radio } from "antd";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import heIL from "antd/es/locale/he_IL";

const { RangePicker } = DatePicker;

const formatDateToHebrew = (date) => {
    return new Date(date).toLocaleDateString("he-IL", {
        month: "short",
    });
};

const rangePresets = [
    {
        label: "3 חודשים אחרונים",
        value: [dayjs().subtract(3, "month"), dayjs()],
    },
    {
        label: "חצי שנה אחרונה",
        value: [dayjs().subtract(6, "month"), dayjs()],
    },
    {
        label: "שנה אחרונה",
        value: [dayjs().subtract(1, "year"), dayjs()],
    },
    {
        label: "שנתיים אחרונות",
        value: [dayjs().subtract(2, "year"), dayjs()],
    },
];

const FilterMenu = ({ filtersConfig, onFilterChange, clearAllFilters }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filters, setFilters] = useState(
        filtersConfig.reduce((acc, filter) => {
            acc[filter.name] = filter.value || null;
            return acc;
        }, {}),
    );

    const handleDropdownVisibleChange = (visible) => {
        setIsDropdownOpen(visible);
    };

    const handleFilterChange = (value, filterName) => {
        setFilters((prevFilters) => {
            const newState = { ...prevFilters, [filterName]: value };
            onFilterChange(newState);
            return newState;
        });
    };

    const handleClearAll = () => {
        const resetFilters = filtersConfig.reduce((acc, filter) => {
            acc[filter.name] = filter.value || null;
            return acc;
        }, {});

        setFilters(resetFilters);
        onFilterChange(resetFilters);
        clearAllFilters();
        setIsDropdownOpen(false);
    };

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false);
    };

    const renderFilterItem = (filter) => {
        const { name, label, type, options, placeholder, checkedChildren, unCheckedChildren } = filter;

        switch (type) {
            case "select":
                return (
                    <Space direction="vertical">
                        <div>{label}</div>
                        <Select
                            value={filters[name]}
                            showSearch
                            filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase())}
                            onChange={(value) => handleFilterChange(value, name)}
                            className="w-200px"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {options.map((option) => (
                                <Select.Option key={option.value} value={option.value} label={option.label}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Space>
                );
            case "monthRange":
                return (
                    <Space direction="vertical">
                        <div>{label}</div>
                        <RangePicker
                            value={filters[name]}
                            onChange={(dates) => handleFilterChange(dates, name)}
                            onClick={(e) => e.stopPropagation()}
                            format={"MM/YYYY"}
                            presets={rangePresets}
                            picker="month"
                            locale={heIL}
                            placeholder={placeholder}
                            cellRender={(date) => {
                                return <div className="ant-picker-cell-inner">{formatDateToHebrew(date)}</div>;
                            }}
                        />
                    </Space>
                );
            case "switch":
                return (
                    <Space direction="vertical">
                        <div>{label}</div>
                        <Switch
                            checked={filters[name]}
                            checkedChildren={checkedChildren}
                            unCheckedChildren={unCheckedChildren}
                            onChange={(checked) => handleFilterChange(checked, name)}
                        />
                    </Space>
                );
            case "radio":
                return (
                    <Space direction="vertical">
                        <div>{label}</div>
                        <Radio.Group buttonStyle="solid" onChange={(e) => handleFilterChange(e.target.value, name)} value={filters[name]}>
                            {options.map((option) => (
                                <Radio.Button key={option.value} value={option.value}>
                                    {option.label}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Space>
                );
            default:
                return null;
        }
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

                        {filtersConfig.map((filter) => (
                            <div key={filter.name}>
                                <div className="py-2 px-3" style={{ cursor: "pointer" }}>
                                    {renderFilterItem(filter)}
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
    filtersConfig: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            options: PropTypes.array,
            value: PropTypes.any,
        }),
    ).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    clearAllFilters: PropTypes.func.isRequired,
};

export default FilterMenu;
