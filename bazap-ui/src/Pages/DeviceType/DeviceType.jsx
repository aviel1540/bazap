import AddIcon from "@mui/icons-material/Add";
import CustomCard from "../../Components/UI/CustomCard";
import LightButton from "../../Components/UI/LightButton";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import DeviceTypeForm from "./DeviceTypeForm";
import DeviceTypeTable from "./DeviceTypeTable";

const DeviceType = () => {
    const { onShow, onHide } = useCustomModal();

    const showModal = () => {
        onShow({
            title: "סוג מוצר חדש",
            name: "deviceType",
            body: <DeviceTypeForm onCancel={() => onHide("deviceType")} />,
        });
    };

    return (
        <CustomCard
            action={
                <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                    הוסף סוג מכשיר
                </LightButton>
            }
            title="סוגי מכשירים"
        >
            <DeviceTypeTable />
        </CustomCard>
    );
};

export default DeviceType;
