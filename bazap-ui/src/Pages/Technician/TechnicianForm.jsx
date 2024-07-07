import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import CustomForm from "../../Components/UI/CustomForm/CustomForm";
import { checkDuplicationInForm } from "../../Utils/formUtils";

import { addTechnician, getAllTechnicians, updateTechnician } from "../../Utils/technicianAPI";
const TechnicianForm = ({ onCancel, formValues = null, isEdit = false }) => {
    const queryClient = useQueryClient();
    const { isLoading, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    const validateTechnicianDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(technicians, "techName", value, isEdit, formValues?.id)) return "שם טכנאי כבר קיים במערכת.";
        }
        return true;
    };

    const handleSave = (data) => {
        if (!isEdit) {
            let newTechnician = { techName: data.techName };
            addTechnicianMutation.mutate(newTechnician);
        } else {
            let editTechnician = {
                id: formValues.id,
                techName: data.techName,
            };
            editTechnicianMutation.mutate(editTechnician);
        }
    };

    const addTechnicianMutation = useMutation(addTechnician, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
            onCancel();
        },
    });
    const editTechnicianMutation = useMutation(updateTechnician, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
            onCancel();
        },
    });
    const fields = [
        {
            label: "שם טכנאי",
            name: "techName",
            type: "text",
            placeholder: "לדוגמא אורי",
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
                // validate: (fieldValue) => {
                //     return !isNaN(fieldValue) || "שדה זה חייב להיות רק מספרים";
                // },
                validate: validateTechnicianDuplication,
            },
        },
    ];
    return (
        <CustomForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            isPasswordRequired
            values={formValues}
            isLoading={isLoading}
        ></CustomForm>
    );
};

TechnicianForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    editId: propTypes.string,
};

export default TechnicianForm;
