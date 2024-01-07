// import { TextField } from "@mui/material";
// import PropTypes from "prop-types";

// const textInputTypes = ["text", "number", "email"];
// const FormInput = (props) => {
//     const { label, name, type, placeholder, register, validators, errors } = props;
//     const emptyProps = { required: false };
//     const fieldProps = validators ? validators : emptyProps;
//     const isTextInput = textInputTypes.includes(type);

//     if (isTextInput) {
//         return (
//             <TextField
//                 error={errors && errors[name]}
//                 id={name}
//                 name={name}
//                 fullWidth
//                 margin="normal"
//                 placeholder={placeholder}
//                 label={label}
//                 helperText={errors && errors[name] && errors[name].message}
//                 variant="outlined"
//                 {...register(name, { ...fieldProps })}
//             />
//         );
//     } else {
//         return <div>need to do this {type} type of input </div>;
//     }
// };
// FormInput.propTypes = {
//     label: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     type: PropTypes.string.isRequired,
//     placeholder: PropTypes.string,
//     register: PropTypes.func.isRequired,
//     validators: PropTypes.object,
//     errors: PropTypes.object,
// };
// export default FormInput;

import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

const textInputTypes = ["text", "number", "email"];
const FormInput = (props) => {
    const { label, name, type, placeholder, validators, control } = props;
    const isTextInput = textInputTypes.includes(type);

    if (isTextInput) {
        return (
            <Controller
                name={name}
                control={control}
                rules={validators}
                render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
                    <TextField
                        helperText={error ? error.message : null}
                        size="small"
                        error={!!error}
                        onChange={onChange}
                        value={value}
                        placeholder={placeholder}
                        fullWidth
                        label={label}
                        variant="outlined"
                    />
                )}
            />
        );
    } else {
        return <div>need to do this {type} type of input </div>;
    }
};
FormInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    register: PropTypes.func.isRequired,
    validators: PropTypes.object,
    errors: PropTypes.object,
};
export default FormInput;
