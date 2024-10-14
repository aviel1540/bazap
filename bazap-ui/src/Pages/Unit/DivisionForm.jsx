import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { checkDuplicationInForm } from "../../Utils/formUtils";
import GenericForm from "../../Components/UI/Form/GenericForm/GenericForm";
import { addNewDivision, getAllDivisions, updateDivisionName } from "../../Utils/divisionAPI";

const DivisionForm = ({ onCancel, formValues = null, isEdit = false, open }) => {
    const queryClient = useQueryClient();

    const { isLoading, data: divisions } = useQuery({
        queryKey: ["divisions"],
        queryFn: getAllDivisions,
    });

    const validateDivisionDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(divisions, "division_name", value, isEdit, formValues?.id)) return "שם אוגדה כבר קיים במערכת.";
        }
        return true;
    };

    const handleSave = async (data) => {
        if (!isEdit) {
            return await addDivisionMutation.mutateAsync(data);
        } else {
            let editDivision = {
                id: formValues.id,
                division_name: data.division_name,
            };
            return await editDivisionMutation.mutateAsync(editDivision);
        }
    };

    const addDivisionMutation = useMutation(addNewDivision, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["divisions"] });
            queryClient.invalidateQueries({ queryKey: ["brigades"] });
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onCancel();
            return true;
        },
    });

    const editDivisionMutation = useMutation(updateDivisionName, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["divisions"] });
            queryClient.invalidateQueries({ queryKey: ["brigades"] });
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onCancel();
            return true;
        },
    });

    const fields = [
        {
            label: "שם אוגדה",
            name: "divisionName",
            type: "text",
            placeholder: "לדוגמא אוגדה 36",
            rules: [
                { required: true, message: "יש למלא שדה זה." },
                { min: 2, message: "שדה זה חייב לפחות 2 תווים" },
                {
                    validator: (_, value) => {
                        const validationResult = validateDivisionDuplication(value);
                        if (validationResult === true) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(validationResult));
                    },
                },
            ],
            span: 24,
        },
    ];

    return (
        <GenericForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            initialValues={formValues}
            title={isEdit ? "עריכת אוגדה" : "אוגדה חדשה"}
            visible={open}
            isLoading={isLoading}
        />
    );
};

DivisionForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    open: propTypes.bool,
};

export default DivisionForm;
