import UnitTable from "./UnitTable";
import UnitForm from "./UnitForm";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";
import CustomCard from "../../UI/CustomCard";

const Unit = () => {
    const { onShow, onHide } = useCustomModal();

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
                <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                    הוסף יחידה
                </LightButton>
            }
            title="יחידות"
        >
            <UnitTable onEdit={showModal} />
        </CustomCard>
    );
};

export default Unit;
