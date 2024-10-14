import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useProject } from "../../../Components/store/ProjectContext";
import { DeviceStatuses } from "../../../Utils/utils";
import { updateStatus as deviceUpdateStatus } from "../../../Utils/deviceApi";
import { updateStatus as accessoryUpdateStatus } from "../../../Utils/accessoryAPI";
import GenericForm from "../../../Components/UI/Form/GenericForm/GenericForm";

const statuses = Object.values(DeviceStatuses);
const devicesStatuses = statuses.filter(
    (status) =>
        ![
            DeviceStatuses.DEFECTIVE_RETURN,
            DeviceStatuses.FIXED_RETURN,
            DeviceStatuses.FINISHED,
            DeviceStatuses.FINISHED_OUT,
            DeviceStatuses.FINISHED,
        ].includes(status),
);
const accessoriesStatuses = [DeviceStatuses.WAIT_TO_WORK, DeviceStatuses.AT_WORK, DeviceStatuses.FINISHED];
const convertStringToOptions = (options) =>
    options.map((option) => {
        return { label: option, value: option };
    });

const StatusForm = ({ onCancel, formValues = null, open, clearSelectedRows }) => {
    const { projectId, refetchAll } = useProject();
    const queryClient = useQueryClient();

    const updateDeviceStatusMutation = useMutation(deviceUpdateStatus, {
        onSuccess: () => {
            refetchAll();
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            clearSelectedRows();
        },
    });

    const updateAccesoryStatusMutation = useMutation(accessoryUpdateStatus, {
        onSuccess: () => {
            refetchAll();
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            clearSelectedRows();
        },
    });

    const handelSave = async (values) => {
        const { devices, status, isClassified } = values;
        devices.map((selectedDevice) => {
            if (isClassified) {
                updateDeviceStatusMutation.mutate({ id: selectedDevice._id, status: status });
            } else {
                updateAccesoryStatusMutation.mutate({ id: selectedDevice._id, status: status });
            }
        });
        onCancel();
    };

    const fields = [
        {
            label: "סטטוס חדש",
            name: "status",
            type: "select",
            rules: [{ required: true, message: "יש למלא שדה זה." }],
            options: convertStringToOptions(formValues.isClassified ? devicesStatuses : accessoriesStatuses),
        },
    ];
    return (
        <GenericForm
            fields={fields}
            onSubmit={handelSave}
            onCancel={onCancel}
            initialValues={formValues}
            title="שינוי סטטוס"
            visible={open}
            isLoading={updateDeviceStatusMutation.isLoading || updateAccesoryStatusMutation.isLoading}
        />
    );
};

StatusForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
    formValues: PropTypes.object,
    open: PropTypes.bool,
    clearSelectedRows: PropTypes.func.isRequired,
};

export default StatusForm;
