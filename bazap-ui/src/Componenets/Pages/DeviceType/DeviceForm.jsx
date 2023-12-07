import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomForm from "../../UI/CustomForm/CustomForm";
import { addDeviceType } from "../../../Utils/deviceTypeApi";
import { swalFire } from "../../UI/Swal";
import propTypes from "prop-types";

const DeviceForm = ({ onCancel, formValues = null, isEdit }) => {
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
            //editDeviceTypeMutation.mutate(editDeviceType);
        }
    };
    const addDeviceTypeMutation = useMutation(addDeviceType, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deviceTypes"] });
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
            <CustomForm inputs={deviceNameInputObj} onSubmit={onSubmit} onCancel={onCancel} values={formValues}></CustomForm>
        </>
    );
};

DeviceForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    editId: propTypes.string,
};

DeviceForm.defaultProps = {
    isEdit: false,
};

export default DeviceForm;
