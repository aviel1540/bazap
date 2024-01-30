import { MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import PropTypes, { object } from "prop-types";
import { forwardRef } from "react";
const ControlledSelect = forwardRef((props, ref) => {
    const { name, label, control, validators, onFieldChange, options, placeholder } = props;

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
                    onChange={(event) => {
                        onChange(event);
                        onFieldChange(event.target.value);
                    }}
                    defaultValue=""
                    value={value ?? ""}
                    placeholder={placeholder}
                    fullWidth
                    select
                    label={label}
                    variant="outlined"
                >
                    {options.map((opt) => (
                        <MenuItem key={`${opt.value}${name}`} value={opt.value}>
                            {opt.text}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
});
ControlledSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    validators: PropTypes.object,
    control: PropTypes.object,
    options: PropTypes.arrayOf(object),
    onFieldChange: PropTypes.func,
};
ControlledSelect.defaultProps = {
    onFieldChange: () => {},
};
ControlledSelect.displayName = "ControlledSelect";

export default ControlledSelect;
