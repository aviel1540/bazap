import AddIcon from "@mui/icons-material/Add";
import CustomCard from "../../Components/UI/CustomCard";
import LightButton from "../../Components/UI/LightButton";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import TechnicianForm from "./TechnicianForm";
import TechnicianTable from "./TechnicianTable";

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
                <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                    הוסף טכנאי
                </LightButton>
            }
            title="טכנאים"
        >
            <TechnicianTable />
        </CustomCard>
    );
};

export default Technician;
