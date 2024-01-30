import { Box, Button, FormControl, Stack, TextField } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import LightButton from "../../../UI/LightButton";
import Divider from "@mui/material/Divider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "../../../../Utils/deviceApi";
import { useAlert } from "../../../store/AlertContext";
import ControlledInput from "../../../UI/CustomForm/ControlledInput";
import { FormProvider, useForm } from "react-hook-form";
import PropTypes, { object } from "prop-types";
import { useProject } from "../../../store/ProjectContext";
import { DeviceStatuses } from "../../../../Utils/utils";

const deviceStatusOptions = Object.values(DeviceStatuses).map((value) => ({
    value: value,
    text: value,
}));

const StatusForm = ({ status, onCacnel, devices, clearSelectedRows }) => {
    const { projectId } = useProject();
    const { onAlert } = useAlert();
    const queryClient = useQueryClient();
    const methods = useForm({
        defaultValues: {
            projectId,
        },
    });
    const { handleSubmit, getValues, control, trigger } = methods;

    const updateStatusMutation = useMutation(updateStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["arrivedDevices", projectId] });
            clearSelectedRows();
        },
        onError: ({ message }) => {
            const options = { showCancel: false, icon: "error" };
            const error = { message, options };
            onAlert(error);
        },
    });

    const handelSave = async () => {
        const result = await trigger("status");
        if (result) {
            devices.map((selectedDevice) => {
                const device = getValues();
                updateStatusMutation.mutate({ id: selectedDevice._id, status: device.status });
            });
            onCacnel();
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
                            onClick={onCacnel}
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
    onCacnel: PropTypes.func.isRequired,
    status: PropTypes.string,
    devices: PropTypes.arrayOf(object).isRequired,
    clearSelectedRows: PropTypes.func.isRequired,
};
export default StatusForm;
