import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { FormControl, Stack, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes, { object } from "prop-types";
import { useForm } from "react-hook-form";
import ControlledInput from "../../../Components/UI/CustomForm/ControlledInput";
import { useProject } from "../../../Components/store/ProjectContext";
import { DeviceStatuses } from "../../../Utils/utils";
import { updateStatus as deviceUpdateStatus } from "../../../Utils/deviceApi";
import { updateStatus as accessoryUpdateStatus } from "../../../Utils/accessoryAPI";
import CustomForm from "../../../Components/UI/CustomForm/CustomForm";

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
        return { value: option, text: option };
    });

const StatusForm = ({ status, onCancel, devices, clearSelectedRows, isClassified }) => {
    const { projectId, refetchAll } = useProject();
    const queryClient = useQueryClient();
    const methods = useForm();
    const { getValues, control, trigger } = methods;

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

    const handelSave = async () => {
        const result = await trigger("status");
        if (result) {
            devices.map((selectedDevice) => {
                const device = getValues();
                if (isClassified) {
                    updateDeviceStatusMutation.mutate({ id: selectedDevice._id, status: device.status });
                } else {
                    updateAccesoryStatusMutation.mutate({ id: selectedDevice._id, status: device.status });
                }
            });
            onCancel();
        }
    };

    const newStatusInputObj = [
        {
            label: "סטטוס חדש",
            name: "status",
            type: "select",
            validators: {
                required: "יש למלא שדה זה.",
            },
            options: convertStringToOptions(isClassified ? devicesStatuses : accessoriesStatuses),
        },
    ];

    return (
        <CustomForm onSubmit={handelSave} onCancel={onCancel} isLoading={false}>
            <Stack direction="row" p={3} justifyContent="center" alignItems="center">
                <TextField disabled id="outlined-disabled" label="סטטוס נוכחי" defaultValue={status} />
                <KeyboardDoubleArrowLeftIcon fontSize="large" color="success" />
                <FormControl fullWidth>
                    {newStatusInputObj.map((input) => (
                        <ControlledInput key={input.name} {...input} control={control} />
                    ))}
                </FormControl>
            </Stack>
        </CustomForm>
    );
};

StatusForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
    status: PropTypes.string,
    isClassified: PropTypes.bool,
    devices: PropTypes.arrayOf(object).isRequired,
    clearSelectedRows: PropTypes.func.isRequired,
};

export default StatusForm;
