import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import LightButton from "../LightButton";
import PropTypes from "prop-types";
import { Box, DialogActions, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import ControlledInput from "./ControlledInput";
const CustomForm = (props) => {
    const { inputs, onSubmit, onCancel, values, hideActions, children } = props;

    const {
        // register,
        handleSubmit,
        reset,
        control,
        // formState: { errors },
    } = useForm({
        values,
    });

    const populateInputs = () => {
        return (
            <Stack spacing={1}>
                {inputs.map((input) => {
                    return <ControlledInput key={input.name} {...input} control={control} />;
                })}
            </Stack>
        );
    };
    const handleCancel = () => {
        onCancel();
        reset();
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box padding={2}>{populateInputs()}</Box>
            <Divider variant="fullWidth" sx={{ paddingTop: 2 }} />
            <DialogActions>
                {hideActions == false && (
                    <>
                        <Button size="small" type="submit" variant="contained">
                            שמור
                        </Button>
                        <LightButton
                            size="small"
                            btncolor="dark"
                            onClick={handleCancel}
                            variant="contained"
                            sx={{
                                marginX: {
                                    xs: "10px",
                                },
                            }}
                        >
                            בטל
                        </LightButton>
                    </>
                )}
                {hideActions == false && children && { children }}
            </DialogActions>
        </form>
    );
};
CustomForm.propTypes = {
    inputs: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    values: PropTypes.object,
    hideActions: PropTypes.bool,
    children: PropTypes.node,
};
CustomForm.defaultProps = {
    hideActions: false,
};
export default CustomForm;
