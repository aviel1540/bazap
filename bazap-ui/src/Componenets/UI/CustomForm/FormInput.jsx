import { Form } from "react-bootstrap";

const textInputTypes = ["text", "number", "email"];
const FormInput = (props) => {
    const { label, name, type, placeholder, register, validators, errors } = props;
    const emptyProps = { required: false };
    const fieldProps = validators ? validators : emptyProps;
    const isTextInput = textInputTypes.includes(type);
    if (isTextInput) {
        return (
            <Form.Group className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    isInvalid={errors && errors[name]}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    {...register(name, { ...fieldProps })}
                />
                {errors && errors[name] && <Form.Control.Feedback type="invalid">{errors[name].message}</Form.Control.Feedback>}
            </Form.Group>
        );
    } else {
        return <div>need to do this {type} type of input </div>;
    }
};

export default FormInput;
