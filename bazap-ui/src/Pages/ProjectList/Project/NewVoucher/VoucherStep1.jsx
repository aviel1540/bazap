import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Loader from "../../../../Components/Layout/Loader";
import { getAllTechnicians } from "../../../../Utils/technicianAPI";
import { getAllUnits } from "../../../../Utils/unitAPI";
import RenderFields from "../../../../Components/UI/CustomForm/RenderFields";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../../../Components/UI/CustomButton/CustomButton";
import { useCustomModal } from "../../../../Components/store/CustomModalContext";
import UnitForm from "../../../Unit/UnitForm";
import TechnicianForm from "../../../Technician/TechnicianForm";
import { Tooltip } from "antd";

const VoucherStep1 = () => {
    const { onShow, onHide } = useCustomModal();
    const { methods } = useFormContext();
    const { formMethods } = methods;
    const { getValues, getFieldState } = formMethods;

    const isTypeSelected = !!getValues("type") && !getFieldState("type").isDirty;

    const [technicianType, setTechnicianType] = useState({
        arrivedBy: getValues("type") === "true" ? "text" : "select",
        receivedBy: getValues("type") === "true" ? "select" : "text",
    });

    const showUnitModal = () => {
        onShow({
            title: "יחידה חדשה",
            name: "unit",
            body: <UnitForm onCancel={() => onHide("unit")} />,
        });
    };
    const showTechnicianModal = () => {
        onShow({
            title: "טכנאי חדש",
            name: "technician",
            body: <TechnicianForm onCancel={() => onHide("technician")} />,
        });
    };

    const { isLoading: isLoadingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const { isLoading: isLoadingTechnicians, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    const unitOptions = units?.map((unit) => ({
        text: unit.unitsName,
        value: unit._id,
        ...unit,
    }));

    const technicianOptions = technicians?.map((technician) => ({
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
                    arrivedBy: boolValue ? "text" : "select",
                    receivedBy: boolValue ? "select" : "text",
                });
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
            colSpan: 22,
            extra: (
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

    return <RenderFields stepFields={voucherInputs} />;
};

export default VoucherStep1;
