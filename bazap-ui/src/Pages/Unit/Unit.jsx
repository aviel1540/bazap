import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import CustomCard from "../../Components/UI/CustomCard";
import LightButton from "../../Components/UI/LightButton";
import UnitForm from "./UnitForm";
import UnitTable from "./UnitTable";

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
