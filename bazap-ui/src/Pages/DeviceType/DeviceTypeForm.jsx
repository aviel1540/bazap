import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDeviceType, getAllDeviceTypes } from "../../../Utils/deviceTypeApi";
import propTypes from "prop-types";
import { useUserAlert } from "../../store/UserAlertContext";
import CustomForm from "../../UI/CustomForm/CustomForm";
import { checkDuplicationInForm } from "../../../Utils/formUtils";

const DeviceTypeForm = ({ onCancel, formValues = null, isEdit }) => {
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["units"],
        queryFn: getAllDeviceTypes,
    });
    const { onAlert, error } = useUserAlert();
    const queryClient = useQueryClient();
    const handleSave = (data) => {
        if (!isEdit) {
            let newDeviceType = { deviceName: data.deviceName };
            addDeviceTypeMutation.mutate(newDeviceType);
        } else {
            let editDeviceType = {
                id: formValues.id,
                deviceName: data.deviceName,
            };
            alert("edit: " + JSON.stringify(editDeviceType));
        }
    };
    const validateDeviceTypeDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(deviceTypes, "deviceName", value, isEdit, formValues?.id)) return "שם סוג משכיר כבר קיים במערכת.";
        }
        return true;
    };

    const addDeviceTypeMutation = useMutation(addDeviceType, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deviceTypes"] });
            onCancel();
        },
    });

    const fields = [
        {
            label: "שם סוג מכשיר",
            name: "deviceName",
            type: "text",
            placeholder: "לדוגמא RPT",
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
                validate: validateDeviceTypeDuplication,
            },
        },
    ];

    return (
        <>
            <CustomForm
                inputs={fields}
                onSubmit={handleSave}
                onCancel={onCancel}
                values={formValues}
                isLoading={isLoading || addDeviceTypeMutation.isLoading}
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
