import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Loader from "../../../../Components/Layout/Loader";
import { getAllTechnicians } from "../../../../Utils/technicianAPI";
import { getAllUnits } from "../../../../Utils/unitAPI";
import RenderFields from "../../../../Components/UI/CustomForm/RenderFields";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../../../Components/UI/CustomButton/CustomButton";
import UnitForm from "../../../Unit/UnitForm";
import TechnicianForm from "../../../Technician/TechnicianForm";
import { Tooltip } from "antd";
import { sortOptions } from "../../../../Utils/utils";

const VoucherStep1 = () => {
    const { methods } = useFormContext();
    const { formMethods } = methods;
    const { getValues, getFieldState, resetField } = formMethods;
    const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

    const showTechnicianModal = () => {
        setIsTechnicianModalOpen(true);
    };
    const showUnitModal = () => {
        setIsUnitModalOpen(true);
    };

    const handleCancel = () => {
        setIsTechnicianModalOpen(false);
        setIsUnitModalOpen(false);
    };
    const isTypeSelected = getValues("type") === "false" && !getFieldState("type").isDirty;
    const [technicianType, setTechnicianType] = useState({
        arrivedBy: getValues("type") === "true" ? "text" : "autocomplete",
        receivedBy: getValues("type") === "true" ? "autocomplete" : "text",
    });

    const { isLoading: isLoadingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const { isLoading: isLoadingTechnicians, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    const unitOptions = sortOptions(units, "unitsName")?.map((unit) => ({
        text: unit.unitsName,
        value: unit._id,
    }));

    const technicianOptions = sortOptions(technicians, "techName")?.map((technician) => ({
        text: technician.techName,
        value: technician.techName,
    }));

    const isLoading = isLoadingUnits || isLoadingTechnicians;

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
                const boolValue = newValue === "true";
                setTechnicianType({
                    arrivedBy: boolValue ? "text" : "autocomplete",
                    receivedBy: boolValue ? "autocomplete" : "text",
                });
                resetField("arrivedBy");
                resetField("receivedBy");
            },
        },
        {
            label: "יחידה",
            name: "unit",
            colSpan: 22,
            extra: (
                <Tooltip title="הוסף יחידה חדשה">
                    <CustomButton type="light-primary" onClick={showUnitModal} icon={<PlusOutlined />} />
                </Tooltip>
            ),
            type: "autocomplete",
            validators: {
                required: "יש למלא שדה זה.",
            },
            getOptionLabel: (option) => option.text,
            getOptionKey: (option) => option.text,
            isStandardOption: true,
            options: unitOptions,
        },
        {
            label: "חייל מנפק",
            name: "arrivedBy",
            type: technicianType.arrivedBy,
            colSpan: getValues("type") === "false" ? 22 : 24,
            extra: getValues("type") === "false" && (
                <Tooltip title="הוסף טכנאי חדש">
                    <CustomButton type="light-primary" onClick={showTechnicianModal} icon={<PlusOutlined />} />
                </Tooltip>
            ),
            placeholder: "לדוגמא מור",
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
            },
            getOptionLabel: (option) => option.text,
            isStandardOption: true,
            options: technicianOptions,
        },
        {
            label: "חייל מקבל",
            name: "receivedBy",
            disabled: isTypeSelected,
            type: technicianType.receivedBy,
            colSpan: getValues("type") === "true" ? 22 : 24,
            placeholder: "לדוגמא משה",
            extra: getValues("type") === "true" && (
                <Tooltip title="הוסף טכנאי חדש">
                    <CustomButton type="light-primary" onClick={showTechnicianModal} icon={<PlusOutlined />} />
                </Tooltip>
            ),
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
            },
            getOptionLabel: (option) => option.text,
            isStandardOption: true,
            options: technicianOptions,
        },
    ];

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <RenderFields stepFields={voucherInputs} />
            <TechnicianForm formValues={null} open={isTechnicianModalOpen} onCancel={handleCancel} isEdit={false} />
            <UnitForm formValues={null} open={isUnitModalOpen} onCancel={handleCancel} isEdit={false} />
        </>
    );
};

export default VoucherStep1;
