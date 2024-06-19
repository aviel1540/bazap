import CustomCard from "../../Components/UI/CustomCard";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import DeviceTypeForm from "./DeviceTypeForm";
import DeviceTypeTable from "./DeviceTypeTable";
import CustomButton from "../../Components/UI/CustomButton";
import { PlusOutlined } from "@ant-design/icons";

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
                <CustomButton type="light-primary" iconPosition="end" onClick={showModal} icon={<PlusOutlined />}>
                    הוסף סוג מכשיר
                </CustomButton>
            }
            title="סוגי מכשירים"
        >
            <DeviceTypeTable />
        </CustomCard>
    );
};

export default DeviceType;
