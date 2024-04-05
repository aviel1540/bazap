import { useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../Utils/deviceTypeApi";
import LightButton from "../../UI/LightButton";
import DeviceTypeTable from "./DeviceTypeTable";
import DeviceTypeForm from "./DeviceTypeForm";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";
import CustomCard from "../../UI/CustomCard";

const DeviceType = () => {
    const { onShow, onHide } = useCustomModal();
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
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
            <DeviceTypeTable deviceTypes={deviceTypes} isLoading={isLoading} />
        </CustomCard>
    );
};

export default DeviceType;
