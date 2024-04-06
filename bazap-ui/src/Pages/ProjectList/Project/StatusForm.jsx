import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Box, Button, FormControl, Stack, TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes, { object } from "prop-types";
import { FormProvider, useForm } from "react-hook-form";
import ControlledInput from "../../../Components/UI/CustomForm/ControlledInput";
import LightButton from "../../../Components/UI/LightButton";
import { useProject } from "../../../Components/store/ProjectContext";
import { DeviceStatuses } from "../../../Utils/utils";
import { updateStatus } from "../../../Utils/deviceApi";
const statuses = Object.values(DeviceStatuses);
const filteredStatuses = statuses.filter((status) => ![DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN].includes(status));
const deviceStatusOptions = filteredStatuses.map((value) => ({
    value: value,
    text: value,
}));

const StatusForm = ({ status, onCancel, devices, clearSelectedRows }) => {
    const { projectId } = useProject();
    const queryClient = useQueryClient();
    const methods = useForm({
        defaultValues: {
            projectId,
        },
    });
    const { handleSubmit, getValues, control, trigger } = methods;

    const updateStatusMutation = useMutation(updateStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
            clearSelectedRows();
        },
    });

    const handelSave = async () => {
        const result = await trigger("status");
        if (result) {
            devices.map((selectedDevice) => {
                const device = getValues();
                updateStatusMutation.mutate({ id: selectedDevice._id, status: device.status });
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
            options: deviceStatusOptions,
        },
    ];
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handelSave)}>
                <Stack direction="row" p={3} justifyContent="center" alignItems="center">
                    <TextField disabled id="outlined-disabled" label="סטטוס נוכחי" defaultValue={status} />
                    <KeyboardDoubleArrowLeftIcon fontSize="large" color="success" />
                    <FormControl fullWidth>
                        {newStatusInputObj.map((input) => {
                            return <ControlledInput key={input.name} {...input} control={control} />;
                        })}
                    </FormControl>
                </Stack>
                <Box>
                    <Divider variant="fullWidth" sx={{ paddingTop: 2 }} />
                    <Stack spacing={2} direction="row" marginTop={2}>
                        <Button size="small" onClick={handelSave} variant="contained">
                            שמור
                        </Button>
                        <LightButton
                            size="small"
                            btncolor="dark"
                            onClick={onCancel}
                            variant="contained"
                            sx={{
                                marginX: {
                                    xs: "10px",
                                },
                            }}
                        >
                            בטל
                        </LightButton>
                    </Stack>
                </Box>
            </form>
        </FormProvider>
    );
};

StatusForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
    status: PropTypes.string,
    devices: PropTypes.arrayOf(object).isRequired,
    clearSelectedRows: PropTypes.func.isRequired,
};
export default StatusForm;
