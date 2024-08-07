import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import CustomForm from "../../Components/UI/CustomForm/CustomForm";
import { checkDuplicationInForm } from "../../Utils/formUtils";
import { addUnit, getAllUnits, updateUnit } from "../../Utils/unitAPI";

const UnitForm = ({ onCancel, formValues = null, isEdit = false }) => {
    const queryClient = useQueryClient();

    const { isLoading, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const validateUnitDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(units, "unitsName", value, isEdit, formValues?.id)) return "שם טכנאי כבר קיים במערכת.";
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
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
                validate: validateUnitDuplication,
            },
        },
    ];
    return (
        <CustomForm
            fields={fields}
            onSubmit={handleSave}
            isPasswordRequired
            onCancel={onCancel}
            values={formValues}
            isLoading={isLoading || addUnitMutation.isLoading || editUnitMutation.isLoading}
        ></CustomForm>
    );
};

UnitForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    editId: propTypes.string,
};

export default UnitForm;
