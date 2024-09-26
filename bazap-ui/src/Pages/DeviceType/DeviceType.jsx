import CustomCard from "../../Components/UI/CustomCard";
import DeviceTypeForm from "./DeviceTypeForm";
import DeviceTypeTable from "./DeviceTypeTable";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import SearchInput from "../../Components/UI/SearchInput";
import FilterMenu from "../../Components/UI/FilterMenu";
import { useState } from "react";

const DeviceType = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        isClassified: "all",
    });
    const [open, setOpen] = useState(false); // Control modal visibility
    const [editData, setEditData] = useState(null); // Store data for editing

    const showModal = (event, data = null) => {
        setEditData(data); // If data is passed, it means we are in edit mode
        setOpen(true); // Open the modal
    };

    const handleCancel = () => {
        setOpen(false); // Close the modal
        setEditData(null); // Reset editData when modal is closed
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

            <DeviceTypeForm
                formValues={editData} // Pass data for editing
                open={open} // Control modal visibility
                onCancel={handleCancel} // Handle cancel/close modal
                isEdit={!!editData} // Pass isEdit flag
            />
        </CustomCard>
    );
};

export default DeviceType;
