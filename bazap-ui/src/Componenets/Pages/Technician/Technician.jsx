import CustomModal from "../../UI/CustomModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TechnicianTable from "./TechnicianTable";
import TechnicianForm from "./TechnicianForm";
import { getAllTechnicians } from "../../../Utils/technicianAPI";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";

const Technician = () => {
    const [show, setShow] = useState(false);
    const { isLoading, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
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
        <Card>
            <CardHeader
                action={
                    <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                        הוסף טכנאי
                    </LightButton>
                }
                titleTypographyProps={{ variant: "h5" }}
                title="טכנאים"
            />
            <CardContent>
                <TechnicianTable technicians={technicians} isLoading={isLoading} />
            </CardContent>
            <CustomModal {...modalProperties}>
                <TechnicianForm onCancel={hideModal} />
            </CustomModal>
        </Card>
    );
};

export default Technician;
