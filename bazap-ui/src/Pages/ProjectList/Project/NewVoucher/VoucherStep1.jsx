import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "antd";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Loader from "../../../../Components/Layout/Loader";
import ControllerInput from "../../../../Components/UI/CustomForm/ControlledInput";
import { getAllTechnicians } from "../../../../Utils/technicianAPI";
import { getAllUnits } from "../../../../Utils/unitAPI";

const VoucherStep1 = () => {
    const { control, getValues, getFieldState } = useFormContext();
    const isTypeSelected = !!getValues("type") && getFieldState("type").isDirty == false;

    const [technicianType, setTechnicianType] = useState({
        arrivedBy: getValues("type") == "true" ? "text" : "select",
        receivedBy: getValues("type") == "true" ? "select" : "text",
    });

    const { isLoading: isLoadingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const { isLoading: isLoadingTechnician, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });
    const unitOptions = units?.map((unit) => {
        return { text: unit.unitsName, value: unit._id, ...unit };
    });
    const technicianOptions = technicians?.map((technician) => {
        return { text: technician.techName, value: technician.techName };
    });
    const isLoading = isLoadingUnits || isLoadingTechnician;

    const voucherInputs = [
        {
            label: "סוג שובר",
            name: "type",
            type: "buttonRadio",
            disabled: isTypeSelected,
            validators: {
                required: "יש למלא שדה זה.",
            },
            options: [
                { value: "true", text: "קבלה" },
                { value: "false", text: "ניפוק" },
            ],
            onFieldChange: (newValue) => {
                const boolValue = newValue == "true";
                const newTechnicianType = {
                    arrivedBy: boolValue ? "text" : "select",
                    receivedBy: boolValue ? "select" : "text",
                };
                setTechnicianType(newTechnicianType);
            },
        },
        {
            label: "יחידה",
            name: "unit",
            type: "select",
            validators: {
                required: "יש למלא שדה זה.",
            },
            options: unitOptions,
        },
        {
            label: "חייל מנפק",
            name: "arrivedBy",
            type: technicianType.arrivedBy,
            placeholder: "לדוגמא מור",
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
            },
            options: technicianOptions,
        },
        {
            label: "חייל מקבל",
            name: "receivedBy",
            disabled: isTypeSelected,
            type: technicianType.receivedBy,
            placeholder: "לדוגמא משה",
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
            },
            options: technicianOptions,
        },
    ];
    if (isLoading) {
        return <Loader />;
    }
    return (
        <Box padding={2}>
            <Row gutter={[10, 10]}>
                {voucherInputs.map((input) => {
                    return (
                        <Col span={24} key={input.name}>
                            <ControllerInput {...input} control={control} />
                        </Col>
                    );
                })}
            </Row>
        </Box>
    );
};
export default VoucherStep1;
