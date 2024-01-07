import { FormControl, FormHelperText, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Controller } from "react-hook-form";
import PropTypes, { object } from "prop-types";

const ControllerButtonRadio = (props) => {
    const { name, label, control, validators, onFieldChange, options } = props;
    return (
        <Controller
            name={name}
            control={control}
            rules={validators}
            render={({ field: { onChange, value, disabled }, fieldState: { error } }) => (
                <FormControl fullWidth>
                    <ToggleButtonGroup
                        fullWidth
                        color="primary"
                        disabled={disabled}
                        value={value}
                        onChange={(event) => {
                            onChange(event);
                            onFieldChange(event.currentTarget.value);
                        }}
                        label={label}
                    >
                        {options.map((opt) => (
                            <ToggleButton key={opt.value} value={opt.value}>
                                {opt.text}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                    <FormHelperText error={!!error}>{error ? error.message : null}</FormHelperText>
                </FormControl>
            )}
        />
    );
};

ControllerButtonRadio.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    validators: PropTypes.object,
    control: PropTypes.object,
    options: PropTypes.arrayOf(object),
    onFieldChange: PropTypes.func,
};
ControllerButtonRadio.defaultProps = {
    onFieldChange: () => {},
};
export default ControllerButtonRadio;
