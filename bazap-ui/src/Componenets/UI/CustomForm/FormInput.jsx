import { FormControl, TextField } from "@mui/material";
import PropTypes from "prop-types";

const textInputTypes = ["text", "number", "email"];
const FormInput = (props) => {
    const { label, name, type, placeholder, register, validators, errors } = props;
    const emptyProps = { required: false };
    const fieldProps = validators ? validators : emptyProps;
    const isTextInput = textInputTypes.includes(type);
    if (isTextInput) {
        return (
            <>
                <TextField
                    error={errors && errors[name]}
                    id={name}
                    name={name}
                    fullWidth
                    placeholder={placeholder}
                    label={label}
                    helperText={errors && errors[name] && errors[name].message}
                    variant="standard"
                    {...register(name, { ...fieldProps })}
                />
            </>
            // <Form.Group className="mb-3">
            //     <Form.Label>{label}</Form.Label>
            //     <Form.Control
            //         isInvalid={errors && errors[name]}
            //         type={type}
            //         name={name}
            //         placeholder={placeholder}
            //         {...register(name, { ...fieldProps })}
            //     />
            //     {errors && errors[name] && <Form.Control.Feedback type="invalid">{errors[name].message}</Form.Control.Feedback>}
            // </Form.Group>
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
    errors: PropTypes.object, // Adjust the shape based on your errors object
};
export default FormInput;
