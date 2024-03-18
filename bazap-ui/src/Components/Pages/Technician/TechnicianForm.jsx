import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomForm from "../../UI/CustomForm/CustomForm";
import propTypes from "prop-types";
import { addTechnician, updateTechnician } from "../../../Utils/technicianAPI";
import { useUserAlert } from "../../store/UserAlertContext";

const TechnicianForm = ({ onCancel, formValues = null, isEdit }) => {
    const { onAlert, error } = useUserAlert();

    const queryClient = useQueryClient();
    const onSubmit = (data) => {
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
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const editTechnicianMutation = useMutation(updateTechnician, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
            onCancel();
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const deviceNameInputObj = [
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
            },
        },
    ];
    return <CustomForm inputs={deviceNameInputObj} onSubmit={onSubmit} onCancel={onCancel} values={formValues}></CustomForm>;
};

TechnicianForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    editId: propTypes.string,
};

TechnicianForm.defaultProps = {
    isEdit: false,
};

export default TechnicianForm;
