import { forwardRef } from "react";
import PropTypes from "prop-types";
import ControlledButtonRadio from "./ControllerInputs/ControlledButtonRadio";
import ControlledSelect from "./ControllerInputs/ControlledSelect";
import ControlledTextField from "./ControllerInputs/ControlledTextField";
import ControlledAutocomplete from "./ControllerInputs/ControlledAutoComplete";

const textInputTypes = ["text", "number", "email"];

const ControlledInput = forwardRef((props, ref) => {
    const { type } = props;
    const lowerType = type.toLowerCase();
    const isTextInput = textInputTypes.includes(type);
    const isSelect = lowerType === "select";
    const isButtonRadio = lowerType === "buttonradio";
    const isAutoComplete = lowerType === "autocomplete";

    if (isButtonRadio) {
        return <ControlledButtonRadio ref={ref} {...props} />;
    }
    if (isAutoComplete) {
        return <ControlledAutocomplete ref={ref} {...props} />;
    }
    if (isSelect) {
        return <ControlledSelect ref={ref} {...props} />;
    }
    if (isTextInput) {
        return <ControlledTextField ref={ref} {...props} />;
    }
    return <div>need to do this {type} type of input </div>;
});

ControlledInput.propTypes = {
    type: PropTypes.string.isRequired,
};
ControlledInput.displayName = "ControlledInput";

export default ControlledInput;