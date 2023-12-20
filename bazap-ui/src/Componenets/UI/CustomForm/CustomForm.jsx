import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import Button from "@mui/material/Button";
import LightButton from "../LightButton";
import PropTypes from "prop-types";
import { Box, DialogActions } from "@mui/material";

const CustomForm = (props) => {
    const { inputs, onSubmit, onCancel, values } = props;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        values,
    });
    const populateInputs = () => {
        return inputs.map((input) => {
            return <FormInput key={input.name} {...input} register={register} errors={errors} />;
        });
    };
    const handleCancel = () => {
        onCancel();
        reset();
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>{populateInputs()}</Box>
            <DialogActions>
                <Button size="small" type="submit" variant="contained">
                    שמור
                </Button>
                <LightButton
                    size="small"
                    btnColor="primary"
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
            </DialogActions>
        </form>
    );
};
CustomForm.propTypes = {
    inputs: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
};
export default CustomForm;
