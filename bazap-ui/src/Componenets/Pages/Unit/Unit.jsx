import CustomModal from "../../UI/CustomModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UnitTable from "./UnitTable";
import UnitForm from "./UnitForm";
import { getAllUnits } from "../../../Utils/unitAPI";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../UI/LightButton";
import AddIcon from "@mui/icons-material/Add";

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
                <CardHeader
                    action={
                        <LightButton variant="contained" btncolor="primary" onClick={showModal} size="small" icon={<AddIcon />}>
                            הוסף יחידה
                        </LightButton>
                    }
                    titleTypographyProps={{ variant: "h5" }}
                    title="סוגי מכשירים"
                />
                <CardContent>
                    <UnitTable deviceTypes={deviceTypes} isLoading={isLoading} />
                </CardContent>
                <CustomModal {...modalProperties}>
                    <UnitForm onCancel={hideModal} />
                </CustomModal>
            </Card>
        </>
    );
};

export default Unit;
