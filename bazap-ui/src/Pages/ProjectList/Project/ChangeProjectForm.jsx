import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { getAllProjects } from "../../../Utils/projectAPI";
import { changeVoucherProject } from "../../../Utils/voucherApi";
import GenericForm from "../../../Components/UI/Form/GenericForm/GenericForm";
const ChangeProjectForm = ({ onCancel, formValues = null, open }) => {
    const queryClient = useQueryClient();
    const { isLoading, data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
    const handleSave = (data) => {
        alert((data.voucherId, data.project));
        // changeProjectMutation(data.voucherId, data.project);
    };

    const changeProjectMutation = useMutation(changeVoucherProject, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onCancel();
        },
    });
    const fields = [
        {
            label: "פרוייקט חדש",
            name: "project",
            type: "select",
            options: projects?.map((proj) => {
                return { label: proj.projectName, value: proj._id };
            }),
            rules: [{ required: true, message: "יש לבחור פרוייקט." }],
            span: 24,
        },
    ];

    return (
        <GenericForm
            fields={fields}
            onSubmit={handleSave}
            onCancel={onCancel}
            isPasswordRequired
            initialValues={formValues}
            title="שינוי פרוייקט"
            visible={open}
            isLoading={isLoading}
        />
    );
};

ChangeProjectForm.propTypes = {
    formValues: propTypes.object,
    onCancel: propTypes.func,
    open: propTypes.bool,
};

export default ChangeProjectForm;
