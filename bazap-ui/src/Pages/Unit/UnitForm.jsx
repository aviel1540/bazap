import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { checkDuplicationInForm } from "../../Utils/formUtils";
import { addUnit, getAllUnits, updateUnit } from "../../Utils/unitAPI";
import GenericForm from "../../Components/UI/Form/GenericForm/GenericForm";
import { getAllDivisions } from "../../Utils/divisionAPI";
import { getAllBrigades } from "../../Utils/brigadeAPI";
import { useState } from "react";

const UnitForm = ({ onCancel, formValues = null, isEdit = false, open }) => {
    const queryClient = useQueryClient();
    const [selectedDivision, setSelectedDivision] = useState(null);
    const { isLoading: isLoadingDivision, data: divisions } = useQuery({
        queryKey: ["divisions"],
        queryFn: getAllDivisions,
    });
    const { isLoading, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const { isLoading: isLoadingBrigade, data: brigades } = useQuery({
        queryKey: ["brigades"],
        queryFn: getAllBrigades,
    });

    const validateUnitDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(units, "unitsName", value, isEdit, formValues?.id)) return "שם יחידה כבר קיים במערכת.";
        }
        return true;
    };

    const handleSave = async (data) => {
        if (!isEdit) {
            return await addUnitMutation.mutateAsync(data);
        } else {
            let editUnit = {
                id: formValues.id,
                unitsName: data.unitName,
            };
            return await editUnitMutation.mutateAsync(editUnit);
        }
    };

    const addUnitMutation = useMutation(addUnit, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            handleCancel();
            return true;
        },
    });

    const editUnitMutation = useMutation(updateUnit, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            handleCancel();
            return true;
        },
    });

    const fields = [
        {
            label: "אוגדה",
            name: "divisionId",
            type: "select",
            onChange: ({ value }) => {
                setSelectedDivision(value);
            },
            placeholder: "בחר אוגדה",
            options: divisions?.map((division) => ({
                value: division._id,
                label: division.division_name,
            })),
            rules: [{ required: true, message: "יש לבחור אוגדה." }],
            span: 8,
        },
        {
            label: "חטיבה",
            name: "brigade",
            type: "select",
            disabled: selectedDivision == null,
            placeholder: "בחר חטיבה",
            options: brigades
                ?.filter((brigade) => {
                    if (selectedDivision == null) {
                        return true;
                    } else {
                        return brigade?.division?._id === selectedDivision;
                    }
                })
                ?.map((brigade) => ({
                    value: brigade._id,
                    label: brigade.brigadeName,
                })),
            rules: [{ required: true, message: "יש לבחור חטיבה." }],
            span: 8,
        },
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
            span: 8,
        },
    ];
    const handleCancel = () => {
        setSelectedDivision(null);
        onCancel();
    };
    return (
        <GenericForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            isPasswordRequired
            initialValues={formValues}
            title={isEdit ? "עריכת יחידה" : "יחידה חדשה"}
            visible={open}
            isLoading={isLoading || isLoadingDivision || isLoadingBrigade}
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
