import { useQuery } from "@tanstack/react-query";
import TechnicianTable from "./TechnicianTable";
import TechnicianForm from "./TechnicianForm";
import { getAllTechnicians } from "../../../Utils/technicianAPI";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";

const Technician = () => {
    const { onShow, onHide } = useCustomModal();
    const { isLoading, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });
    const modalProperties = {
        title: "טכנאי חדש",
        maxWidth: "md",
        body: <TechnicianForm onCancel={onHide} />,
    };
    const showModal = () => {
        onShow(modalProperties);
    };

    return (
        <Card>
            <CardHeader
                action={
                    <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                        הוסף טכנאי
                    </LightButton>
                }
                titleTypographyProps={{ variant: "h5" }}
                title="טכנאים"
            />
            <CardContent>
                <TechnicianTable technicians={technicians} isLoading={isLoading} />
            </CardContent>
        </Card>
    );
};

export default Technician;
