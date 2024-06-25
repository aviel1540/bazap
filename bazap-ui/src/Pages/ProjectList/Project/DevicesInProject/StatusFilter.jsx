import { InfoCircleOutlined } from "@ant-design/icons";
import { Avatar, Select, Space, Tooltip } from "antd";
import PropTypes from "prop-types";
import { ALL, DeviceStatuses, FIXED_OR_DEFECTIVE, RETURNED } from "../../../../Utils/utils";

const StatusFilter = ({ checkIfStatusExists, handleStatusChange, selectedStatus }) => {
    const excludedStatuses = [
        DeviceStatuses.DEFECTIVE_RETURN,
        DeviceStatuses.FIXED_RETURN,
        DeviceStatuses.FIXED,
        DeviceStatuses.DEFECTIVE,
        DeviceStatuses.FINISHED,
    ];

    const getStatusesOptions = () => {
        const statuses = [
            ALL,
            ...Object.values(DeviceStatuses).filter((status) => !excludedStatuses.includes(status) && checkIfStatusExists(status)),
            FIXED_OR_DEFECTIVE,
            RETURNED,
        ];

        return statuses.map((status) => ({
            value: status,
            label: status,
        }));
    };

    return (
        <Space>
            <Select
                allowClear
                defaultValue={ALL}
                value={selectedStatus}
                onChange={handleStatusChange}
                style={{ width: 200 }}
                options={getStatusesOptions()}
            />
            <Tooltip placement="top" title="כדי לשנות סטטוסים של מכשירים יש לסנן לפי סטטוס" arrow={true}>
                <Avatar size={30} icon={<InfoCircleOutlined />} />
            </Tooltip>
        </Space>
    );
};

StatusFilter.propTypes = {
    checkIfStatusExists: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    selectedStatus: PropTypes.string,
};

export default StatusFilter;
