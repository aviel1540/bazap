import UnitTable from "./UnitTable";
import UnitForm from "./UnitForm";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";

const Unit = () => {
    const { onShow, onHide } = useCustomModal();

    const showModal = (event, data) => {
        const isEdit = data != undefined;
        const modalProperties = {
            title: "יחידה חדשה",
            name: "unit",
            body: <UnitForm formValues={data} onCancel={() => onHide("unit")} isEdit={isEdit} />,
        };
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
                <UnitTable onEdit={showModal} />
            </CardContent>
        </Card>
    );
};

export default Unit;
