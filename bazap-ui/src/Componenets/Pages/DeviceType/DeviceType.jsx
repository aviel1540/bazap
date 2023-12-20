// import { Button, Card } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../Utils/deviceTypeApi";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import DeviceTypeTable from "./DeviceTypeTable";
import CustomModal from "../../UI/CustomModal";
import DeviceForm from "./DeviceForm";
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
                    <LightButton variant="contained" btnColor="primary" onClick={showModal} size="small">
                        הוסף סוג מכשיר חדש
                    </LightButton>
                }
                titleTypographyProps={{ variant: "h5" }}
                title="סוגי מכשירים"
            />
            {/* <Card>
                </Card>
               */}
            <CardContent>
                <CustomModal {...modalProperties}>
                    <DeviceForm onCancel={hideModal} />
                </CustomModal>
                <DeviceTypeTable deviceTypes={deviceTypes} isLoading={isLoading} />
            </CardContent>
        </Card>
    );
};

export default DeviceType;
