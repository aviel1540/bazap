import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import GenericForm from "../../Components/UI/GenericForm";
import { checkDuplicationInForm } from "../../Utils/formUtils";
import { addUnit, getAllUnits, updateUnit } from "../../Utils/unitAPI";

const UnitForm = ({ onCancel, formValues = null, isEdit = false, open }) => {
    const queryClient = useQueryClient();

    const { isLoading, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });

    const validateUnitDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(units, "unitsName", value, isEdit, formValues?.id)) return "שם יחידה כבר קיים במערכת.";
        }
        return true;
    };

    const handleSave = (data) => {
        if (!isEdit) {
            let newUnit = { unitName: data.unitName };
            addUnitMutation.mutate(newUnit);
        } else {
            let editUnit = {
                id: formValues.id,
                unitsName: data.unitName,
            };
            editUnitMutation.mutate(editUnit);
        }
    };

    const addUnitMutation = useMutation(addUnit, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onCancel();
        },
    });

    const editUnitMutation = useMutation(updateUnit, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onCancel();
        },
    });

    const fields = [
        {
            label: "שם יחידה",
            name: "unitName",
            type: "text",
            placeholder: "לדוגמא 319",
            rules: [
                { required: true, message: "יש למלא שדה זה." },
                { min: 2, message: "שדה זה חייב לפחות 2 תווים" },
                {
                    validator: (_, value) => {
                        const validationResult = validateUnitDuplication(value);
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
            isPasswordRequired
            initialValues={formValues}
            title={isEdit ? "עריכת יחידה" : "יחידה חדשה"}
            visible={open}
            isLoading={isLoading}
        />
    );
};

UnitForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    open: propTypes.bool,
};

export default UnitForm;
