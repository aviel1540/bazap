import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { checkDuplicationInForm } from "../../Utils/formUtils";
import { addProject, getAllProjects, updateProject } from "../../Utils/projectAPI";
import GenericForm from "../../Components/UI/Form/GenericForm/GenericForm";
import { useUserAlert } from "../../Components/store/UserAlertContext";

const ProjectForm = ({ onCancel, formValues = null, isEdit = false, open }) => {
    const queryClient = useQueryClient();
    const { onAlert } = useUserAlert();
    // Fetch all projects
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });

    // Duplication validation for project names
    const validateProjectDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(projects, "projectName", value, isEdit, formValues?.id)) {
                return "שם פרוייקט כבר קיים במערכת.";
            }
        }
        return true;
    };

    // Handle save operation for both new and edit modes
    const handleSave = async (data) => {
        if (!isEdit) {
            const newProject = { projectName: data.projectName };
            return await addProjectMutation.mutateAsync(newProject);
        } else {
            const editProject = {
                id: formValues.id,
                projectName: data.projectName,
            };
            return await editProjectMutation.mutateAsync(editProject);
        }
    };

    // Mutation for adding a new project
    const addProjectMutation = useMutation(addProject, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            const { message } = data;
            if (message) {
                onAlert(message, "success", true);
            }
            onCancel();
            return true;
        },
    });

    // Mutation for editing an existing project
    const editProjectMutation = useMutation(updateProject, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            onCancel();
            return true;
        },
    });

    // Define form fields for GenericForm
    const fields = [
        {
            label: "שם פרוייקט",
            name: "projectName",
            type: "text",
            placeholder: "לדוגמא מיפוי 319",
            rules: [
                { required: true, message: "יש למלא שדה זה." },
                { min: 2, message: "שדה זה חייב לפחות 2 תווים" },
                {
                    validator: (_, value) => {
                        const validationResult = validateProjectDuplication(value);
                        if (validationResult === true) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(validationResult));
                    },
                },
            ],
        },
    ];

    return (
        <GenericForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            // isPasswordRequired
            initialValues={formValues}
            title={isEdit ? "עריכת פרוייקט" : "פרוייקט חדש"}
            visible={open}
            isLoading={isLoading || addProjectMutation.isLoading}
        />
    );
};

ProjectForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    open: propTypes.bool,
};

export default ProjectForm;
