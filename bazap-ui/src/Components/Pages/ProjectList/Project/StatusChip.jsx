import Chip from "@mui/material/Chip";
import propTypes from "prop-types";

const StatusChip = ({ status, onClick, varient, color }) => {
    return <Chip label={status} color={color} variant={varient} {...(onClick !== undefined && { onClick: onClick })} />;
};
StatusChip.propTypes = {
    status: propTypes.string.isRequired,
    onClick: propTypes.func,
    varient: propTypes.string,
    color: propTypes.string,
};
StatusChip.defaultProps = {
    varient: "contained",
};
export default StatusChip;
