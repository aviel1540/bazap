import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomForm from "../../Components/UI/CustomForm/CustomForm";
import propTypes from "prop-types";
import { addProject, getAllProjects, updateProject } from "../../Utils/projectAPI";
import { checkDuplicationInForm } from "../../Utils/formUtils";

const ProjectForm = ({ onCancel, formValues = null, isEdit = false }) => {
    const queryClient = useQueryClient();
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });

    const handleSave = (data) => {
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
    });
    const editProjectMutation = useMutation(updateProject, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", formValues.id] });

            onCancel();
        },
    });
    const validateProjectDuplication = (value) => {
        if (value) {
            if (checkDuplicationInForm(projects, "projectName", value, isEdit, formValues?.id)) return "שם פרוייקט כבר קיים במערכת.";
        }
        return true;
    };
    const fields = [
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
                validate: validateProjectDuplication,
            },
        },
    ];
    return (
        <CustomForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            values={formValues}
            isLoading={isLoading || addProjectMutation.isLoading}
        ></CustomForm>
    );
};

ProjectForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    isEdit: propTypes.bool,
    editId: propTypes.string,
};

export default ProjectForm;
