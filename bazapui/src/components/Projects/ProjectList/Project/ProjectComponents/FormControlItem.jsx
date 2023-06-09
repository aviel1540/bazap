/* eslint-disable react/prop-types */
import { Form } from 'react-bootstrap';
// import Select from 'react-select/dist/declarations/src/Select';
import Select from 'react-select';
export const FormControlItem = (props) => {
    const { index, value, handleChange, name, label, type = 'text', options = [] } = props;
    const renderInput = () => {
        if (type == 'select') {
            let optionsItems = options.map(opt => {
                return { value: opt, label: opt }
            })
            // return (
            //     // <Select
            //     // value={value}
            //     // onChange={handleChange}
            //     // options={optionsItems}
            //     // ></Select>
            // )
        }

        return <Form.Control
            type={type}
            name={`${name}_${index}`}
            value={value}
            onChange={handleChange}
        />
    }
    return (
        <Form.Group key={index} controlId={`${name}_${index}`}>
            <Form.Label>{label}:</Form.Label>
            {renderInput()}
        </Form.Group>
    )
}