import { Form, Select } from "antd";
import PropTypes from "prop-types";

const FormSelect = ({ input }) => {
    const { name, label, rules, placeholder, options, style } = input;
    return (
        <Form.Item key={name} label={label} name={name} rules={rules} style={style}>
            <Select placeholder={placeholder} options={options} />
        </Form.Item>
    );
};

FormSelect.propTypes = {
    input: PropTypes.object.isRequired,
};

export default FormSelect;
