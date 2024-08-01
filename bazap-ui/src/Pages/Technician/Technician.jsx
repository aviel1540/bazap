import CustomCard from "../../Components/UI/CustomCard";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import TechnicianForm from "./TechnicianForm";
import TechnicianTable from "./TechnicianTable";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import { useState } from "react";
import { Space } from "antd";
import SearchInput from "../../Components/UI/SearchInput";

const Technician = () => {
    const { onShow, onHide } = useCustomModal();
    const [searchQuery, setSearchQuery] = useState("");

    const showModal = (event, data) => {
        const isEdit = data != undefined;
        onShow({
            title: "טכנאי חדש",
            name: "technician",
            body: <TechnicianForm onCancel={() => onHide("technician")} isEdit={isEdit} />,
        });
    };

    return (
        <CustomCard
            action={
                <Space>
                    <SearchInput onSearch={setSearchQuery} />
                    <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף טכנאי
                    </CustomButton>
                </Space>
            }
            title="טכנאים"
        >
            <TechnicianTable onEdit={showModal} searchQuery={searchQuery} />
        </CustomCard>
    );
};

export default Technician;
