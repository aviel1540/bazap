import Chip from "@mui/material/Chip";
import { Stack } from "@mui/material";
import PropTypes from "prop-types";
import { ALL, DeviceStatuses, FIXED_OF_DEFFECTIVE, RETURNED, chipColors } from "../../../../../Utils/utils";
import { Select } from "antd";

const StatusFilter = ({ checkIfStatusExists, handleStatusChange, selectedStatus }) => {
    const getStatusesOptions = () => {
        const options = [];
        options.push({
            value: ALL,
            label: ALL,
        });
        const filteredStatuses = Object.values(DeviceStatuses).filter(
            (status) =>
                ![DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN, DeviceStatuses.FIXED, DeviceStatuses.DEFECTIVE].includes(
                    status,
                ) && checkIfStatusExists(status),
        );
        filteredStatuses.forEach((item) =>
            options.push({
                value: item,
                label: item,
            }),
        );
        return options;
    };

    return (
        <>
            <Select
                defaultValue={selectedStatus}
                onChange={handleStatusChange}
                style={{
                    width: 200,
                }}
                options={getStatusesOptions()}
            />
        </>
    );
};

StatusFilter.propTypes = {
    checkIfStatusExists: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    selectedStatus: PropTypes.string,
};
export default StatusFilter;
