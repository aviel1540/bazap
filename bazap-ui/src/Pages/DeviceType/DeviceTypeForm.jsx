import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { addDeviceType, getAllDeviceTypes, updateDeviceType } from "../../Utils/deviceTypeApi";
import { useEffect, useState } from "react";
import { checkDuplicationInForm } from "../../Utils/formUtils";
import GenericForm from "../../Components/UI/Form/GenericForm/GenericForm";

const DeviceTypeForm = ({ onCancel, formValues = null, isEdit = false, open }) => {
    const queryClient = useQueryClient();

    // Fetch all device types
    const { isLoading, data: deviceTypes } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: getAllDeviceTypes,
    });

    const [fields, setFields] = useState([]);

    useEffect(() => {
        // Prepare form fields dynamically based on formValues and isEdit status
        const fieldsConfig = [
            {
                label: "שם סוג מכשיר",
                name: "deviceName",
                type: "text",
                span: 24,
                placeholder: "לדוגמא RPT",
                rules: [
                    { required: true, message: "יש למלא שדה זה." },
                    { min: 2, message: "שדה זה חייב לפחות 2 תווים" },
                    { validator: (_, value) => validateDeviceTypeNameDuplication(value) },
                ],
            },
            {
                label: 'מק"ט',
                name: "catalogNumber",
                type: "text",
                span: 24,
                placeholder: "לדוגמא 12344-555",
                rules: [
                    { required: true, message: "יש למלא שדה זה." },
                    { min: 2, message: "שדה זה חייב לפחות 2 תווים" },
                    { pattern: /^[0-9-]*$/, message: 'מק"ט יכול להכיל רק מספרים ומקפים' },
                    { validator: (_, value) => validateDeviceTypeCatalogNumberDuplication(value) },
                ],
            },
            {
                label: "סוג מכשיר",
                name: "isClassified",
                type: "radiobutton",
                span: 24,
                disabled: isEdit,
                options: [
                    { value: "true", label: "מסווג" },
                    { value: "false", label: 'צל"מ' },
                ],
                rules: [{ required: true, message: "יש למלא שדה זה." }],
            },
        ];
        setFields(fieldsConfig);
    }, [isEdit, formValues]);

    // Handle save operation for both new and edit modes
    const handleSave = (data) => {
        if (!isEdit) {
            let newDevice = { ...data, isClassified: data.isClassified === "true" };
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

    // Validate device name duplication
    const validateDeviceTypeNameDuplication = (value) => {
        if (value && checkDuplicationInForm(deviceTypes, "deviceName", value, isEdit, formValues?.id)) {
            return Promise.reject("שם סוג משכיר כבר קיים במערכת.");
        }
        return Promise.resolve();
    };

    // Validate catalog number duplication
    const validateDeviceTypeCatalogNumberDuplication = (value) => {
        if (value && checkDuplicationInForm(deviceTypes, "catalogNumber", value, isEdit, formValues?.id)) {
            return Promise.reject('מק"ט כבר קיים במערכת.');
        }
        return Promise.resolve();
    };

    // Mutation for adding a new device type
    const addDeviceTypeMutation = useMutation(addDeviceType, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deviceTypes"] });
            onCancel();
        },
    });

    // Mutation for editing an existing device type
    const editDeviceTypeMutation = useMutation(updateDeviceType, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deviceTypes"] });
            onCancel();
        },
    });

    return (
        <GenericForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            isPasswordRequired
            initialValues={formValues}
            title={isEdit ? "ערוך סוג מכשיר" : "סוג מכשיר חדש"}
            visible={open} // Visible prop to control the modal display
            isLoading={isLoading || addDeviceTypeMutation.isLoading || editDeviceTypeMutation.isLoading}
        />
    );
};

DeviceTypeForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func.isRequired,
    isEdit: propTypes.bool.isRequired,
    open: propTypes.bool.isRequired,
};

export default DeviceTypeForm;
