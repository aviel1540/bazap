import { AutoComplete, Form } from "antd";
import PropTypes from "prop-types";

const FormAutoComplete = ({ input }) => {
    const { name, rules, options, style, onSearch, onSelect, placeholder } = input;
    return (
        <Form.Item rules={rules} style={style} name={name}>
            <AutoComplete options={options} onSearch={onSearch} onSelect={onSelect} placeholder={placeholder} />
        </Form.Item>
    );
};

FormAutoComplete.propTypes = {
    input: PropTypes.object.isRequired,
};
export default FormAutoComplete;
