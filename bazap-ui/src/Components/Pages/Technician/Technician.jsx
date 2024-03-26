import TechnicianTable from "./TechnicianTable";
import TechnicianForm from "./TechnicianForm";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";

const Technician = () => {
    const { onShow, onHide } = useCustomModal();

    const showModal = (event, data) => {
        const isEdit = data != undefined;
        const modalProperties = {
            title: "טכנאי חדש",
            body: <TechnicianForm onCancel={onHide} formValues={data} isEdit={isEdit} />,
        };
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
                <TechnicianTable onEdit={showModal} />
            </CardContent>
        </Card>
    );
};

export default Technician;
