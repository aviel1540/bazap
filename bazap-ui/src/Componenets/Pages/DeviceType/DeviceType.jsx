// import { Button, Card } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../Utils/deviceTypeApi";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import DeviceTypeTable from "./DeviceTypeTable";
import CustomModal from "../../UI/CustomModal";
import DeviceTypeForm from "./DeviceTypeForm";
import AddIcon from "@mui/icons-material/Add";

const DeviceType = () => {
    const [show, setShow] = useState(false);
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
    const showModal = () => {
        setShow(true);
    };
    const hideModal = () => {
        setShow(false);
    };
    const modalProperties = {
        show,
        title: "סוג מוצר חדש",
        cancelButtonHandler: hideModal,
    };
    return (
        <Card>
            <CardHeader
                action={
                    <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                        הוסף סוג מכשיר חדש
                    </LightButton>
                }
                titleTypographyProps={{ variant: "h5" }}
                title="סוגי מכשירים"
            />
            <CardContent>
                <CustomModal {...modalProperties}>
                    <DeviceTypeForm onCancel={hideModal} />
                </CustomModal>
                <DeviceTypeTable deviceTypes={deviceTypes} isLoading={isLoading} />
            </CardContent>
        </Card>
    );
};

export default DeviceType;
