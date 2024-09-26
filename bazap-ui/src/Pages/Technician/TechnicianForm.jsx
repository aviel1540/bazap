import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import GenericForm from "../../Components/UI/GenericForm";
import { checkDuplicationInForm } from "../../Utils/formUtils";
import { addTechnician, getAllTechnicians, updateTechnician } from "../../Utils/technicianAPI";

const TechnicianForm = ({ onCancel, formValues = null, isEdit = false, open }) => {
    const queryClient = useQueryClient();

    // Fetch all technicians
    const { isLoading, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    // Duplication validation for technician names
    const validateTechnicianDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(technicians, "techName", value, isEdit, formValues?.id)) {
                return "שם טכנאי כבר קיים במערכת.";
            }
        }
        return true;
    };

    // Handle save operation for both new and edit modes
    const handleSave = (data) => {
        if (!isEdit) {
            const newTechnician = { techName: data.techName };
            addTechnicianMutation.mutate(newTechnician);
        } else {
            const editTechnician = {
                id: formValues.id,
                techName: data.techName,
            };
            editTechnicianMutation.mutate(editTechnician);
        }
    };

    // Mutation for adding a new technician
    const addTechnicianMutation = useMutation(addTechnician, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
            onCancel();
        },
    });

    // Mutation for editing an existing technician
    const editTechnicianMutation = useMutation(updateTechnician, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
            onCancel();
        },
    });

    // Define form fields for GenericForm
    const fields = [
        {
            label: "שם טכנאי",
            name: "techName",
            type: "text",
            placeholder: "לדוגמא אורי",
            rules: [
                { required: true, message: "יש למלא שדה זה." },
                { min: 2, message: "שדה זה חייב לפחות 2 תווים" },
                {
                    validator: (_, value) => {
                        const validationResult = validateTechnicianDuplication(value);
                        if (validationResult === true) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(validationResult));
                    },
                },
            ],
        },
    ];

    return (
        <GenericForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            isPasswordRequired
            initialValues={formValues}
            title={isEdit ? "עריכת טכנאי" : "טכנאי חדש"}
            visible={open}
            isLoading={isLoading}
        />
    );
};

TechnicianForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    open: propTypes.bool,
};

export default TechnicianForm;
