import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { forwardRef } from "react";

const ControlledAutocomplete = forwardRef((props, ref) => {
    const { name, label, control, validators, onFieldChange, options, placeholder, filterOptions, getOptionLabel, isNumber } = props;

    return (
        <Controller
            name={name}
            control={control}
            rules={validators}
            render={({ field: { onChange, value, disabled }, fieldState: { error } }) => (
                <Autocomplete
                    options={options}
                    getOptionLabel={getOptionLabel}
                    onChange={(_, newValue) => {
                        onChange(newValue.inputValue ? newValue.inputValue : newValue.text);
                        onFieldChange(newValue);
                    }}
                    filterOptions={filterOptions}
                    value={value ?? null}
                    freeSolo
                    selectOnFocus
                    clearOnBlur
                    renderInput={(params) => (
                        <TextField
                            inputRef={ref}
                            {...params}
                            fullWidth
                            type={isNumber ? "number" : "text"}
                            label={label}
                            variant="outlined"
                            placeholder={placeholder}
                            helperText={error ? error.message : null}
                            error={!!error}
                            disabled={disabled}
                        />
                    )}
                />
            )}
        />
    );
});

ControlledAutocomplete.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    validators: PropTypes.object,
    control: PropTypes.object,
    options: PropTypes.arrayOf(PropTypes.object),
    onFieldChange: PropTypes.func,
    filterOptions: PropTypes.func,
    getOptionLabel: PropTypes.func,
    isNumber: PropTypes.bool,
    size: PropTypes.string,
};

ControlledAutocomplete.defaultProps = {
    onFieldChange: () => {},
    getOptionLabel: (option) => option.text,
};
ControlledAutocomplete.displayName = "ControlledAutocomplete";

export default ControlledAutocomplete;