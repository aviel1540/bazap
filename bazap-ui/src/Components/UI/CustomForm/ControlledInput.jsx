import PropTypes from "prop-types";
import ControlledButtonRadio from "./ControllerInputs/ControlledButtonRadio";
import ControlledSelect from "./ControllerInputs/ControlledSelect";
import ControlledTextField from "./ControllerInputs/ControlledTextField";
import ControlledAutocomplete from "./ControllerInputs/ControlledAutoComplete";
import { forwardRef } from "react";

const textInputTypes = ["text", "number", "email"];

const ControlledInput = forwardRef((props, ref) => {
    const { type } = props;
    const lowerType = type.toLowerCase();
    const isTextInput = textInputTypes.includes(type);
    const isSelect = lowerType === "select";
    const isButtonRadio = lowerType === "buttonradio";
    const isAutoComplete = lowerType === "autocomplete";

    if (isButtonRadio) {
        return <ControlledButtonRadio {...props} key={props.name} />;
    }
    if (isAutoComplete) {
        return <ControlledAutocomplete {...props} key={props.name} />;
    }
    if (isSelect) {
        return <ControlledSelect {...props} key={props.name} />;
    }
    if (isTextInput) {
        return <ControlledTextField inputRef={ref} {...props} key={props.name} />;
    }
    return <div>need to do this {type} type of input </div>;
});

ControlledInput.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

ControlledInput.displayName = "ControlledInput";
export default ControlledInput;
