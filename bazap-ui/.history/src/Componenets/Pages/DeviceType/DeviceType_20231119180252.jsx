import { Button, Card } from "react-bootstrap";
import CustomModal from "../../UI/CustomModal";
import { useState } from "react";
import DeviceTypeTable from "./DeviceTypeTable";
import DeviceForm from "./DeviceForm";
import { useMutation } from "react-query";

const DeviceType = () => {

    const [showNewModal, setShowNewModal] = useState(false);

    const handleNewDeviceType = () => {
        setShowNewModal(true);
    };
    const handleCloseModal = () => {
        setShowNewModal(false);
    };
    const modalPropeties = {
        hasFooter: false,
        onHide: handleCloseModal,
        closeButton: true,
        title: "סוג מכשיר חדש",
    };
    const onSubmit = (data) => {

        alert(JSON.stringify(data));
        addSubscriberMutation.mutate(subscriberObj);
    };
    const addSubscriberMutation = useMutation(addSubscriber, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscribers"] });
            handleClose();
        },
        onError: (message) => {
            swalFire({
                html: message,
                icon: "error",
                showCancelButton: false,
            });
        },
    });
    const onCancel = () => {
        alert("cancel");
        handleCloseModal();
    };
    return (
        <Card>
            <div className="card-header">
                <div className="card-title">סוגי מכשירים</div>
                <div className="card-toolbar">
                    <Button size="sm" onClick={handleNewDeviceType} className="btn-light-primary">
                        סוג מכשיר חדש
                    </Button>
                </div>
            </div>
            <Card.Body>
                <DeviceTypeTable />
            </Card.Body>
            <CustomModal show={showNewModal} modalPropeties={modalPropeties}>
                <DeviceForm onSubmit={onSubmit} onCancel={onCancel} />
            </CustomModal>
        </Card>
    );
};

export default DeviceType;
