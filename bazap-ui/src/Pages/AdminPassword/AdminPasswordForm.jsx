// import { useQueryClient } from "@tanstack/react-query";
// import { useUserAlert } from "../../Components/store/UserAlertContext";
import propTypes from "prop-types";
import CustomForm from "../../Components/UI/CustomForm/CustomForm";

const AdminPasswordForm = ({ onCancel }) => {
    // const queryClient = useQueryClient();
    // const { onAlert, error } = useUserAlert();
    const isLoading = false;
    const handleSave = (data) => {
        alert(JSON.stringify(data));
        return true;
    };

    const fields = [
        {
            label: "סיסמא",
            name: "password",
            type: "password",
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
            },
        },
    ];
    return <CustomForm inputs={fields} onSubmit={handleSave} onCancel={onCancel} values={undefined} isLoading={isLoading}></CustomForm>;
};

AdminPasswordForm.propTypes = {
    onCancel: propTypes.func,
};

export default AdminPasswordForm;
