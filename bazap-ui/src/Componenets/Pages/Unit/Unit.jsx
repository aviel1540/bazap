import { Button, Card } from "react-bootstrap";
import CustomModal from "../../UI/CustomModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UnitTable from "./UnitTable";
import UnitForm from "./UnitForm";
import { getAllUnits } from "../../../Utils/unitAPI";

const Unit = () => {
    const [show, setShow] = useState(false);
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
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
                    <div className="card-title">יחידות</div>
                    <div className="card-toolbar">
                        <Button size="sm" className="btn-light-primary" onClick={showModal}>
                            הוסף יחידה
                        </Button>
                    </div>
                </div>
                <Card.Body>
                    <UnitTable deviceTypes={deviceTypes} isLoading={isLoading} />
                </Card.Body>
            </Card>
            <CustomModal {...modalProperties}>
                <UnitForm onCancel={hideModal} />
            </CustomModal>
        </>
    );
};

export default Unit;
