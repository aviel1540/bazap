import { useState } from "react";
import CustomCard from "../../Components/UI/CustomCard";
import UnitForm from "./UnitForm";
import UnitTable from "./UnitTable";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import SearchInput from "../../Components/UI/SearchInput";
import { Space } from "antd";

const Unit = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const showModal = (event, data) => {
        setEditData(data);
        setOpen(true);
    };

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
                        הוסף יחידה
                    </CustomButton>
                </Space>
            }
            title="יחידות"
        >
            <UnitTable onEdit={showModal} searchQuery={searchQuery} />
            <UnitForm formValues={editData} open={open} onCancel={handleCancel} isEdit={!!editData} />
        </CustomCard>
    );
};

export default Unit;
