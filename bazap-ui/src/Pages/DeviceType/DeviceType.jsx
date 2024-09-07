import CustomCard from "../../Components/UI/CustomCard";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import DeviceTypeForm from "./DeviceTypeForm";
import DeviceTypeTable from "./DeviceTypeTable";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import { Select, Space } from "antd";
import SearchInput from "../../Components/UI/SearchInput";
import FilterMenu from "../../Components/UI/FilterMenu"; // Import the FilterMenu component
import { useState } from "react";

const { Option } = Select;

const DeviceType = () => {
    const { onShow, onHide } = useCustomModal();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterValue, setFilterValue] = useState(null); // State for classification filter

    const showModal = (event, data) => {
        const isEdit = data != undefined;
        onShow({
            title: "סוג מוצר חדש",
            name: "deviceType",
            body: <DeviceTypeForm formValues={data} onCancel={() => onHide("deviceType")} isEdit={isEdit} />,
        });
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleFilterChange = (value) => {
        setFilterValue(value); // Update the classification filter value
    };

    const clearAllFilters = () => {
        setFilterValue(null); // Reset the filter value
    };

    // Filter options for the FilterMenu
    const menuItems = [
        {
            label: (
                <Space direction="vertical">
                    <div className="fw-500">סוג מכשיר:</div>
                    <Select
                        defaultValue="all"
                        value={filterValue === null ? "all" : filterValue ? "מסווג" : 'צל"מ'}
                        onChange={handleFilterChange}
                        style={{ width: 120 }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing dropdown
                    >
                        <Option value="all">הכל</Option>
                        <Option value={true}>מסווג</Option>
                        <Option value={false}>צל"מ</Option>
                    </Select>
                </Space>
            ),
            key: "classification", // Adding key to help with unique items in dropdown
        },
    ];

    return (
        <CustomCard
            action={
                <Space>
                    <SearchInput onSearch={handleSearchChange} value={searchQuery} />
                    <FilterMenu clearAllFilters={clearAllFilters} menuItems={menuItems} />
                    <CustomButton type="light-primary" iconPosition="end" onClick={showModal} icon={<PlusOutlined />}>
                        הוסף סוג מכשיר
                    </CustomButton>
                </Space>
            }
            title="סוגי מכשירים"
        >
            <DeviceTypeTable searchQuery={searchQuery} filterValue={filterValue} onEdit={showModal} />
        </CustomCard>
    );
};

export default DeviceType;
