import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomForm from "../../UI/CustomForm/CustomForm";
import propTypes from "prop-types";
import { addProject, updateProject } from "../../../Utils/projectAPI";
import { useUserAlert } from "../../store/UserAlertContext";

const ProjectForm = ({ onCancel, formValues = null, isEdit }) => {
    const { onAlert, error } = useUserAlert();
    const queryClient = useQueryClient();
    const onSubmit = (data) => {
        if (!isEdit) {
            let newProject = { projectName: data.projectName };
            addProjectMutation.mutate(newProject);
        } else {
            let editProject = {
                id: formValues.id,
                projectName: data.projectName,
            };
            editProjectMutation.mutate(editProject);
        }
    };
    const addProjectMutation = useMutation(addProject, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            onCancel();
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const editProjectMutation = useMutation(updateProject, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            onCancel();
        },
        onError: ({ message }) => {
            onAlert(message, error);
        },
    });
    const deviceNameInputObj = [
        {
            label: "שם פרוייקט",
            name: "projectName",
            type: "text",
            placeholder: "לדוגמא מיפוי 319",
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

ProjectForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    editId: propTypes.string,
};

ProjectForm.defaultProps = {
    isEdit: false,
};

export default ProjectForm;
