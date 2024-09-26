import { useState } from "react";
import CustomCard from "../../Components/UI/CustomCard";
import TechnicianForm from "./TechnicianForm";
import TechnicianTable from "./TechnicianTable";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import SearchInput from "../../Components/UI/SearchInput";
import { Space } from "antd";

const Technician = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Show the modal for adding or editing a technician
    const showModal = (event, data) => {
        setEditData(data);
        setOpen(true);
    };

    // Handle cancel action (close modal)
    const handleCancel = () => {
        setOpen(false);
        setEditData(null);
    };

    return (
        <CustomCard
            action={
                <Space>
                    <SearchInput onSearch={setSearchQuery} />
                    <CustomButton type="light-primary" onClick={() => showModal()} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף טכנאי
                    </CustomButton>
                </Space>
            }
            title="טכנאים"
        >
            <TechnicianTable onEdit={showModal} searchQuery={searchQuery} />
            <TechnicianForm formValues={editData} open={open} onCancel={handleCancel} isEdit={!!editData} />
        </CustomCard>
    );
};

export default Technician;
