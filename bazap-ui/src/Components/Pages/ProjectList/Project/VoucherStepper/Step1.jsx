import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../Layout/Loader";
import RenderFields from "../../../../UI/Form/RenderFields";
import PropTypes from "prop-types";
import { getAllUnits } from "../../../../../Utils/unitAPI";
import { replaceApostrophe } from "../../../../../Utils/utils";
import { getAllTechnicians } from "../../../../../Utils/technicianAPI";
import { rulesValidations } from "../../../../../Utils/formUtils";

const Step1 = ({ formData }) => {
    const { isLoading: isLoadingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: async () => {
            const unitsData = await getAllUnits();
            const units = unitsData.map((unit) => {
                return { label: replaceApostrophe(unit.unitsName), value: unit._id, ...unit };
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
                return { label: formattedName, value: formattedName };
            });
            return technicians;
        },
    });
    const isVoucherIsReturn = formData?.type == "false";
    const isLoading = isLoadingUnits || isLoadingTechnician;
    const fields = [
        {
            key: "type",
            name: "type",
            type: "radioButton",
            label: "סוג שובר",
            rules: [rulesValidations.required],
            options: [
                { value: "true", label: "קבלה" },
                { value: "false", label: "ניפוק" },
            ],
        },
        {
            key: "unit",
            name: "unit",
            type: "select",
            label: "יחידה",
            rules: [rulesValidations.required],
            placeholder: "בחר יחידה לדוגמא אוגדה 146",
            options: units,
        },
        {
            key: "technician",
            name: "arrivedBy",
            type: isVoucherIsReturn ? "select" : "text",
            label: "חייל מנפק",
            rules: [rulesValidations.required, rulesValidations.minLength],
            placeholder: "בחר חייל מנפק",
            options: technicians,
        },
        {
            key: "technician",
            name: "receivedBy",
            label: "חייל מקבל",
            type: !isVoucherIsReturn ? "select" : "text",
            rules: [rulesValidations.required, rulesValidations.minLength],
            placeholder: "בחר חייל מנפק",
            options: technicians,
        },
    ];

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && <RenderFields fields={fields} />}
        </>
    );
};

Step1.propTypes = {
    formData: PropTypes.object,
};

export default Step1;
