import CustomCard from "../../Components/UI/CustomCard";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import TechnicianForm from "./TechnicianForm";
import TechnicianTable from "./TechnicianTable";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../Components/UI/CustomButton";

const Technician = () => {
    const { onShow, onHide } = useCustomModal();

    const showModal = () => {
        onShow({
            title: "טכנאי חדש",
            name: "technician",
            body: <TechnicianForm onCancel={() => onHide("technician")} />,
        });
    };

    return (
        <CustomCard
            action={
                <CustomButton type="light-primary" onClick={showModal} iconPosition="end" icon={<PlusOutlined />}>
                    הוסף טכנאי
                </CustomButton>
            }
            title="טכנאים"
        >
            <TechnicianTable />
        </CustomCard>
    );
};

export default Technician;
