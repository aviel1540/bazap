import { useState } from "react";
import CustomCard from "../../Components/UI/CustomCard";
import UnitForm from "./UnitForm";
import UnitTable from "./UnitTable";
import BrigadeForm from "./BrigadeForm";
import BrigadeTable from "./BrigadeTable";
import DivisionForm from "./DivisionForm";
import DivisionTable from "./DivisionTable";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../Components/UI/CustomButton/CustomButton";
import SearchInput from "../../Components/UI/SearchInput";
import { Space } from "antd";

const Unit = () => {
    const [unitSearchQuery, setUnitSearchQuery] = useState("");
    const [brigadeSearchQuery, setBrigadeSearchQuery] = useState("");
    const [divisionSearchQuery, setDivisionSearchQuery] = useState("");
    const [unitOpen, setUnitOpen] = useState(false);
    const [brigadeOpen, setBrigadeOpen] = useState(false);
    const [divisionOpen, setDivisionOpen] = useState(false);
    const [unitEditData, setUnitEditData] = useState(null);
    const [brigadeEditData, setBrigadeEditData] = useState(null);
    const [divisionEditData, setDivisionEditData] = useState(null);

    const showUnitModal = (event, data) => {
        setUnitEditData(data);
        setUnitOpen(true);
    };

    const showBrigadeModal = (event, data) => {
        setBrigadeEditData(data);
        setBrigadeOpen(true);
    };

    const showDivisionModal = (event, data) => {
        setDivisionEditData(data);
        setDivisionOpen(true);
    };

    const handleUnitCancel = () => {
        setUnitOpen(false);
        setUnitEditData(null);
    };

    const handleBrigadeCancel = () => {
        setBrigadeOpen(false);
        setBrigadeEditData(null);
    };

    const handleDivisionCancel = () => {
        setDivisionOpen(false);
        setDivisionEditData(null);
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{
                display: "flex",
            }}
        >
            <CustomCard
                action={
                    <Space>
                        <SearchInput onSearch={setUnitSearchQuery} />
                        <CustomButton type="light-primary" onClick={() => showUnitModal()} iconPosition="end" icon={<PlusOutlined />}>
                            הוסף יחידה
                        </CustomButton>
                    </Space>
                }
                title="יחידות"
            >
                <UnitTable onEdit={showUnitModal} searchQuery={unitSearchQuery} />
                <UnitForm formValues={unitEditData} open={unitOpen} onCancel={handleUnitCancel} isEdit={!!unitEditData} />
            </CustomCard>
            <CustomCard
                action={
                    <Space>
                        <SearchInput onSearch={setBrigadeSearchQuery} />
                        <CustomButton type="light-primary" onClick={() => showBrigadeModal()} iconPosition="end" icon={<PlusOutlined />}>
                            הוסף חטיבה
                        </CustomButton>
                    </Space>
                }
                title="חטיבות"
            >
                <BrigadeTable onEdit={showBrigadeModal} searchQuery={brigadeSearchQuery} />
                <BrigadeForm formValues={brigadeEditData} open={brigadeOpen} onCancel={handleBrigadeCancel} isEdit={!!brigadeEditData} />
            </CustomCard>
            <CustomCard
                action={
                    <Space>
                        <SearchInput onSearch={setDivisionSearchQuery} />
                        <CustomButton type="light-primary" onClick={() => showDivisionModal()} iconPosition="end" icon={<PlusOutlined />}>
                            הוסף אוגדה
                        </CustomButton>
                    </Space>
                }
                title="אוגדות"
            >
                <DivisionTable onEdit={showDivisionModal} searchQuery={divisionSearchQuery} />
                <DivisionForm
                    formValues={divisionEditData}
                    open={divisionOpen}
                    onCancel={handleDivisionCancel}
                    isEdit={!!divisionEditData}
                />
            </CustomCard>
        </Space>
    );
};

export default Unit;
