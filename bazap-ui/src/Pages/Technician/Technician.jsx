import TechnicianTable from "./TechnicianTable";
import TechnicianForm from "./TechnicianForm";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";
import CustomCard from "../../UI/CustomCard";

const Technician = () => {
    const { onShow, onHide } = useCustomModal();

    const showModal = (event, data) => {
        const isEdit = data != undefined;
        onShow({
            title: "טכנאי חדש",
            name: "technician",
            body: <TechnicianForm onCancel={() => onHide("technician")} formValues={data} isEdit={isEdit} />,
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
            <TechnicianTable onEdit={showModal} />
        </CustomCard>
    );
};

export default Technician;
