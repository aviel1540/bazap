import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import { forwardRef } from "react";

const ControlledTextField = forwardRef((props, ref) => {
    const { name, label, control, validators, placeholder } = props;
    return (
        <Controller
            name={name}
            control={control}
            rules={validators}
            render={({ field: { onChange, value, disabled }, fieldState: { error } }) => (
                <TextField
                    inputRef={ref}
                    helperText={error ? error.message : null}
                    error={!!error}
                    disabled={disabled}
                    onChange={onChange}
                    value={value ?? ""}
                    placeholder={placeholder}
                    fullWidth
                    label={label}
                    variant="outlined"
                />
            )}
        />
    );
});
ControlledTextField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    validators: PropTypes.object,
    control: PropTypes.object,
};
ControlledTextField.displayName = "ControlledTextField";

export default ControlledTextField;
