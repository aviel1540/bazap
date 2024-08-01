import { useCustomModal } from "../../Components/store/CustomModalContext";
import CustomCard from "../../Components/UI/CustomCard";
import UnitForm from "./UnitForm";
import UnitTable from "./UnitTable";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import SearchInput from "../../Components/UI/SearchInput";
import { Space } from "antd";
import { useState } from "react";

const Unit = () => {
    const { onShow, onHide } = useCustomModal();
    const [searchQuery, setSearchQuery] = useState("");
    const showModal = (event, data) => {
        const isEdit = data != undefined;
        onShow({
            title: "יחידה חדשה",
            name: "unit",
            body: <UnitForm formValues={data} onCancel={() => onHide("unit")} isEdit={isEdit} />,
        });
    };

    return (
        <CustomCard
            action={
                <Space>
                    <SearchInput onSearch={setSearchQuery} />
                    <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                        הוסף יחידה
                    </CustomButton>
                </Space>
            }
            title="יחידות"
        >
            <UnitTable onEdit={showModal} searchQuery={searchQuery} />
        </CustomCard>
    );
};

export default Unit;
