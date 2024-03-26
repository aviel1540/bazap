import { useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../Utils/deviceTypeApi";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import DeviceTypeTable from "./DeviceTypeTable";
import DeviceTypeForm from "./DeviceTypeForm";
import AddIcon from "@mui/icons-material/Add";
import { useCustomModal } from "../../store/CustomModalContext";

const DeviceType = () => {
    const { onShow, onHide } = useCustomModal();
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
    const modalProperties = {
        title: "סוג מוצר חדש",
        body: <DeviceTypeForm onCancel={onHide} />,
    };
    const showModal = () => {
        onShow(modalProperties);
    };

    return (
        <Card>
            <CardHeader
                action={
                    <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                        הוסף סוג מכשיר
                    </LightButton>
                }
                titleTypographyProps={{ variant: "h5" }}
                title="סוגי מכשירים"
            />
            <CardContent>
                <DeviceTypeTable deviceTypes={deviceTypes} isLoading={isLoading} />
            </CardContent>
        </Card>
    );
};

export default DeviceType;
