import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomForm from "../../UI/CustomForm/CustomForm";
import { swalFire } from "../../UI/Swal";
import propTypes from "prop-types";
import { addUnit, updateUnit } from "../../../Utils/unitAPI";

const UnitForm = ({ onCancel, formValues = null, isEdit }) => {
    const queryClient = useQueryClient();
    const onSubmit = (data) => {
        if (!isEdit) {
            let newUnit = { unitsName: data.unitName };
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
        onError: (message) => {
            swalFire({
                html: message,
                icon: "error",
                showCancelButton: false,
            });
        },
    });
    const editUnitMutation = useMutation(updateUnit, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onCancel();
        },
        onError: (message) => {
            swalFire({
                html: message,
                icon: "error",
                showCancelButton: false,
            });
        },
    });
    const deviceNameInputObj = [
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
            },
        },
    ];
    return (
        <>
            <CustomForm inputs={deviceNameInputObj} onSubmit={onSubmit} onCancel={onCancel} values={formValues}></CustomForm>
        </>
    );
};

UnitForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    editId: propTypes.string,
};

UnitForm.defaultProps = {
    isEdit: false,
};

export default UnitForm;
