import Chip from "@mui/material/Chip";
import { Stack } from "@mui/material";
import PropTypes from "prop-types";
import { ALL, DeviceStatuses, FIXED_OF_DEFFECTIVE, RETURNED, chipColors } from "../../../../../Utils/utils";

const StatusFilter = ({ checkIfStatusExists, handleStatusChange, selectedStatus }) => {
    const handleStatusClick = (status) => {
        handleStatusChange(status === selectedStatus ? null : status);
    };

    const renderStatusChips = () => {
        const filteredStatuses = Object.values(DeviceStatuses).filter(
            (status) =>
                ![DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN, DeviceStatuses.FIXED, DeviceStatuses.DEFECTIVE].includes(
                    status,
                ) && checkIfStatusExists(status),
        );
        return filteredStatuses.map((status) => (
            <Chip
                key={status}
                label={status}
                onClick={() => handleStatusClick(status)}
                color={chipColors[status]}
                variant={status === selectedStatus ? "contained" : "outlined"}
            />
        ));
    };

    return (
        <Stack gap={2} direction="row">
            <Chip
                label={ALL}
                onClick={() => handleStatusClick(ALL)}
                color="info"
                variant={selectedStatus === ALL ? "contained" : "outlined"}
            />
            {renderStatusChips()}
            {checkIfStatusExists(FIXED_OF_DEFFECTIVE) && (
                <Chip
                    label={FIXED_OF_DEFFECTIVE}
                    onClick={() => handleStatusClick(FIXED_OF_DEFFECTIVE)}
                    color="success"
                    variant={selectedStatus === FIXED_OF_DEFFECTIVE ? "contained" : "outlined"}
                />
            )}
            {checkIfStatusExists(RETURNED) && (
                <Chip
                    label={RETURNED}
                    onClick={() => handleStatusClick(RETURNED)}
                    color="success"
                    variant={selectedStatus === RETURNED ? "contained" : "outlined"}
                />
            )}
        </Stack>
    );
};

StatusFilter.propTypes = {
    checkIfStatusExists: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    selectedStatus: PropTypes.string,
};
export default StatusFilter;
