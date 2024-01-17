import Chip from "@mui/material/Chip";
import propTypes from "prop-types";

const StatusChip = ({ status }) => {
    let chipColor = "";

    switch (status) {
        case "ממתין לעבודה":
            chipColor = "error";
            break;
        case "בעבודה":
            chipColor = "info";
            break;
        case "תקין - הוחזר ליחידה":
            chipColor = "success";
            break;
        case "מושבת - הוחזר ליחידה":
            chipColor = "warning";
            break;
        case "מושבת":
            chipColor = "warning";
            break;
        default:
            break;
    }

    return <Chip label={status} color={chipColor} />;
};
StatusChip.propTypes = {
    status: propTypes.string.isRequired,
};
export default StatusChip;
