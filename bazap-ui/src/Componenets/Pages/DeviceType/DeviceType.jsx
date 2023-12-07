import { Button, Card } from "react-bootstrap";
import CustomModal from "../../UI/CustomModal";
import DeviceTypeTable from "./DeviceTypeTable";
import DeviceForm from "./DeviceForm";
import { useQuery } from "@tanstack/react-query";
import { getAllDeviceTypes } from "../../../Utils/deviceTypeApi";
import { useState } from "react";

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
        handleClose: () => {},
        title: "סוג מוצר חדש",
        showExitButton: true,
        showOkButton: false,
        okButtonHandler: hideModal,
        showCancelButton: false,
        cancelButtonHandler: hideModal,
    };
    return (
        <>
            <Card>
                <div className="card-header">
                    <div className="card-title">סוגי מכשירים</div>
                    <div className="card-toolbar">
                        <Button size="sm" className="btn-light-primary" onClick={showModal}>
                            הוסף סוג מכשיר חדש
                        </Button>
                    </div>
                </div>
                <Card.Body>
                    <DeviceTypeTable deviceTypes={deviceTypes} isLoading={isLoading} />
                </Card.Body>
            </Card>
            <CustomModal {...modalProperties}>
                <DeviceForm onCancel={hideModal} />
            </CustomModal>
        </>
    );
};

export default DeviceType;
