import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "antd";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Loader from "../../../../Components/Layout/Loader";
import ControllerInput from "../../../../Components/UI/CustomForm/ControlledInput";
import { getAllTechnicians } from "../../../../Utils/technicianAPI";
import { getAllUnits } from "../../../../Utils/unitAPI";
import { replaceApostrophe } from "../../../../Utils/utils";

const VoucherStep1 = () => {
    const { control, getValues, getFieldState } = useFormContext();
    const isTypeSelected = !!getValues("type") && getFieldState("type").isDirty == false;

    const [technicianType, setTechnicianType] = useState({
        arrivedBy: getValues("type") == "true" ? "text" : "select",
        receivedBy: getValues("type") == "true" ? "select" : "text",
    });
    const { isLoading: isLoadingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: async () => {
            const unitsData = await getAllUnits();
            const units = unitsData.map((unit) => {
                return { text: replaceApostrophe(unit.unitsName), value: unit._id, ...unit };
            });
            return units;
        },
    });
    const { isLoading: isLoadingTechnician, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: async () => {
            const techniciansData = await getAllTechnicians();
            const technicians = techniciansData.map((technician) => {
                const formattedName = replaceApostrophe(technician.techName);
                return { text: formattedName, value: formattedName };
            });
            return technicians;
        },
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
            options: units,
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
            options: technicians,
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
            options: technicians,
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
