import { useQuery } from "@tanstack/react-query";
import UnitTable from "./UnitTable";
import UnitForm from "./UnitForm";
import { getAllUnits } from "../../../Utils/unitAPI";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";

const Unit = () => {
    const { onShow, onHide } = useCustomModal();
    const { isLoading, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const modalProperties = {
        title: "יחידה חדשה",
        maxWidth: "md",
        body: <UnitForm onCancel={onHide} />,
    };
    const showModal = () => {
        onShow(modalProperties);
    };

    return (
        <Card>
            <CardHeader
                action={
                    <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                        הוסף יחידה
                    </LightButton>
                }
                titleTypographyProps={{ variant: "h5" }}
                title="יחידות"
            />
            <CardContent>
                <UnitTable units={units} isLoading={isLoading} />
            </CardContent>
        </Card>
    );
};

export default Unit;
