import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box, DialogActions, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import ControlledInput from "./ControlledInput";
import { Button } from "antd";

const CustomForm = ({ inputs, onSubmit, onCancel, values, hideActions, children, isLoading }) => {
    const { handleSubmit, reset, control } = useForm({
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
                        <Button loading={isLoading} htmlType="submit" type="primary">
                            שמור
                        </Button>
                        <Button
                            loading={isLoading}
                            btncolor="dark"
                            onClick={handleCancel}
                            sx={{
                                marginX: {
                                    xs: "10px",
                                },
                            }}
                        >
                            בטל
                        </Button>
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
    isLoading: PropTypes.bool,
};
CustomForm.defaultProps = {
    hideActions: false,
};
export default CustomForm;
