import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { checkDuplicationInForm } from "../../Utils/formUtils";
import GenericForm from "../../Components/UI/Form/GenericForm/GenericForm";
import { addNewBrigade, getAllBrigades } from "../../Utils/brigadeAPI";
import { getAllDivisions } from "../../Utils/divisionAPI";

const BrigadeForm = ({ onCancel, formValues = null, isEdit = false, open }) => {
    const queryClient = useQueryClient();
    const { isLoading: isLoadingDivision, data: divisions } = useQuery({
        queryKey: ["divisions"],
        queryFn: getAllDivisions,
    });

    const { isLoading: isLoadingBrigade, data: brigades } = useQuery({
        queryKey: ["brigades"],
        queryFn: getAllBrigades,
    });

    const validateBrigadeDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(brigades, "brigadeName", value, isEdit, formValues?.id)) return "שם חטיבה כבר קיים במערכת.";
        }
        return true;
    };

    const handleSave = async (data) => {
        if (!isEdit) {
            return await addBrigadeMutation.mutateAsync(data);
        } else {
            // let editBrigade = {
            //     id: formValues.id,
            //     brigadeName: data.brigadeName,
            // };
            // return await editBrigadeMutation.mutateAsync(editBrigade);
        }
    };

    const addBrigadeMutation = useMutation(addNewBrigade, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brigades"] });
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onCancel();
            return true;
        },
    });

    // const editBrigadeMutation = useMutation(updateBrigade, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["brigades"] });
    //         onCancel();
    //         return true;
    //     },
    // });

    const fields = [
        {
            label: "אוגדה",
            name: "divisionId",
            type: "select",
            placeholder: "בחר אוגדה",
            options: divisions?.map((division) => ({
                value: division._id,
                label: division.division_name,
            })),
            rules: [{ required: true, message: "יש לבחור אוגדה." }],
            span: 12,
        },
        {
            label: "שם חטיבה",
            name: "brigadeName",
            type: "text",
            placeholder: "לדוגמא חטיבה 7",
            rules: [
                { required: true, message: "יש למלא שדה זה." },
                { min: 2, message: "שדה זה חייב לפחות 2 תווים" },
                {
                    validator: (_, value) => {
                        const validationResult = validateBrigadeDuplication(value);
                        if (validationResult === true) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(validationResult));
                    },
                },
            ],
            span: 12,
        },
    ];

    return (
        <GenericForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            initialValues={formValues}
            title={isEdit ? "עריכת חטיבה" : "חטיבה חדשה"}
            visible={open}
            isLoading={isLoadingDivision || isLoadingBrigade}
        />
    );
};

BrigadeForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    open: propTypes.bool,
};

export default BrigadeForm;
