import CustomCard from "../../Components/UI/CustomCard";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import DeviceTypeForm from "./DeviceTypeForm";
import DeviceTypeTable from "./DeviceTypeTable";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import SearchInput from "../../Components/UI/SearchInput";
import FilterMenu from "../../Components/UI/FilterMenu";
import { useState } from "react";

const DeviceType = () => {
    const { onShow, onHide } = useCustomModal();
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        isClassified: "all",
    });

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

    const handleFilterChange = (updatedFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...updatedFilters,
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            isClassified: "all",
        });
        setSearchQuery("");
    };

    const filtersConfig = [
        {
            name: "isClassified",
            label: "סוג מכשיר",
            type: "select",
            value: filters.isClassified,
            options: [
                { value: "all", label: "הכל" },
                { value: true, label: "מסווג" },
                { value: false, label: 'צל"מ' },
            ],
        },
    ];

    return (
        <CustomCard
            action={
                <Space>
                    <SearchInput onSearch={handleSearchChange} value={searchQuery} />
                    <FilterMenu filtersConfig={filtersConfig} onFilterChange={handleFilterChange} clearAllFilters={clearAllFilters} />
                    <CustomButton type="light-primary" iconPosition="end" onClick={showModal} icon={<PlusOutlined />}>
                        הוסף סוג מכשיר
                    </CustomButton>
                </Space>
            }
            title="סוגי מכשירים"
        >
            <DeviceTypeTable searchQuery={searchQuery} filterValue={filters} onEdit={showModal} />
        </CustomCard>
    );
};

export default DeviceType;
