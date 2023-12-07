import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import { Button, Form } from "react-bootstrap";

const CustomForm = (props) => {
    const { inputs, onSubmit, onCancel,values } = props;
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        values
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
        <Form onSubmit={handleSubmit(onSubmit)}>
            {populateInputs()}
            <Button size="sm" className="btn-light-primary me-2" type="submit">
                שמור
            </Button>
            <Button size="sm" className="btn-secondary" onClick={handleCancel}>
                בטל
            </Button>
        </Form>
    );
};

export default CustomForm;
