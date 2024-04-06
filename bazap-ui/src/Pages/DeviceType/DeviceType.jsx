import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import CustomCard from "../../Components/UI/CustomCard";
import LightButton from "../../Components/UI/LightButton";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import { getAllDeviceTypes } from "../../Utils/deviceTypeApi";
import DeviceTypeForm from "./DeviceTypeForm";
import DeviceTypeTable from "./DeviceTypeTable";

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
