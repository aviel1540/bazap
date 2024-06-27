import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import CustomForm from "../../Components/UI/CustomForm/CustomForm";
import { addDeviceType, getAllDeviceTypes, updateDeviceType } from "../../Utils/deviceTypeApi";
import { checkDuplicationInForm } from "../../Utils/formUtils";

const DeviceTypeForm = ({ onCancel, formValues = null, isEdit }) => {
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });
    const queryClient = useQueryClient();
    const handleSave = (data) => {
        if (!isEdit) {
            let newDevice = data;
            newDevice.isClassified = newDevice.isClassified == "true";
            addDeviceTypeMutation.mutate(newDevice);
        } else {
            let editDeviceType = {
                id: formValues.id,
                deviceName: data.deviceName,
                catalogNumber: data.catalogNumber,
            };
            editDeviceTypeMutation.mutate(editDeviceType);
        }
    };
    const validateDeviceTypeNameDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(deviceTypes, "deviceName", value, isEdit, formValues?.id)) {
                return "שם סוג משכיר כבר קיים במערכת.";
            }
        }
        return true;
    };
    const validateDeviceTypeCatalogNumberDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(deviceTypes, "catalogNumber", value, isEdit, formValues?.id)) {
                return 'מק"ט כבר קיים במערכת.';
            }
        }
        return true;
    };

    const addDeviceTypeMutation = useMutation(addDeviceType, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deviceTypes"] });
            onCancel();
        },
    });

    const editDeviceTypeMutation = useMutation(updateDeviceType, {
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
                validate: validateDeviceTypeNameDuplication,
            },
        },
        {
            label: 'מק"ט',
            name: "catalogNumber",
            type: "text",
            placeholder: "לדוגמא 12344-555",
            validators: {
                required: "יש למלא שדה זה.",
                minLength: {
                    value: 2,
                    message: "שדה זה חייב לפחות 2 תווים",
                },
                pattern: {
                    value: /^[0-9-]*$/,
                    message: 'מק"ט יכול להכיל רק מספרים ומקפים',
                },
                validate: validateDeviceTypeCatalogNumberDuplication,
            },
        },
        {
            label: "סוג מכשיר",
            name: "isClassified",
            type: "buttonRadio",
            disabled: isEdit,
            validators: {
                required: "יש למלא שדה זה.",
            },
            options: [
                { value: "true", text: "מסווג" },
                { value: "false", text: 'צל"מ' },
            ],
        },
    ];
    return (
        <CustomForm
            inputs={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            isPasswordRequired
            values={formValues}
            isLoading={isLoading || addDeviceTypeMutation.isLoading}
        ></CustomForm>
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
