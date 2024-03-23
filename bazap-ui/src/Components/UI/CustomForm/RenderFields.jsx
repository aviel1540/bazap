import PropTypes from "prop-types";
import { Stack } from "@mui/material";
import ControlledInput from "./ControlledInput";

const RenderFields = ({ fields, control }) => {
    return (
        <Stack spacing={1} sx={{ paddingTop: 2 }}>
            {fields.map((input) => {
                return <ControlledInput key={input.name} {...input} control={control} />;
            })}
        </Stack>
    );
};

RenderFields.propTypes = {
    fields: PropTypes.array.isRequired,
    control: PropTypes.object.isRequired,
};
export default RenderFields;
