import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomForm from "../../UI/CustomForm/CustomForm";
import { addDeviceType } from "../../../Utils/deviceTypeApi";
import propTypes from "prop-types";
import { useUserAlert } from "../../store/UserAlertContext";

const DeviceTypeForm = ({ onCancel, formValues = null, isEdit }) => {
    const { onAlert, error } = useUserAlert();
    const queryClient = useQueryClient();
    const onSubmit = (data) => {
        if (!isEdit) {
            let newDeviceType = { deviceName: data.deviceTypeName };
            addDeviceTypeMutation.mutate(newDeviceType);
        } else {
            let editDeviceType = {
                id: formValues.id,
                deviceName: data.deviceTypeName,
            };
            alert("edit: " + JSON.stringify(editDeviceType));
        }
    };
    const addDeviceTypeMutation = useMutation(addDeviceType, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deviceTypes"] });
            onCancel();
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const deviceNameInputObj = [
        {
            label: "שם סוג מכשיר",
            name: "deviceTypeName",
            type: "text",
            placeholder: "לדוגמא RPT",
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
            <CustomForm
                inputs={deviceNameInputObj}
                isLoading={addDeviceTypeMutation.isLoading}
                onSubmit={onSubmit}
                onCancel={onCancel}
                values={formValues}
            ></CustomForm>
        </>
    );
};

DeviceTypeForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    editId: propTypes.string,
};

DeviceTypeForm.defaultProps = {
    isEdit: false,
};

export default DeviceTypeForm;
