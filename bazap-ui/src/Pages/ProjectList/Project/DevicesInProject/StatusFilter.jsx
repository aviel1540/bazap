import { InfoCircleOutlined } from "@ant-design/icons";
import { Avatar, Select, Space, Tooltip } from "antd";
import PropTypes from "prop-types";
import { ALL, DeviceStatuses, FIXED_OR_DEFFECTIVE, RETURNED } from "../../../../Utils/utils";

const StatusFilter = ({ checkIfStatusExists, handleStatusChange, selectedStatus }) => {
    const getStatusesOptions = () => {
        const options = [];
        options.push({
            value: ALL,
            label: ALL,
        });
        const statuses = Object.values(DeviceStatuses);
        statuses.push(FIXED_OR_DEFFECTIVE);
        statuses.push(RETURNED);
        const filteredStatuses = statuses.filter(
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
        <Space>
            <Select
                allowClear
                defaultValue={ALL}
                value={selectedStatus}
                onChange={handleStatusChange}
                style={{
                    width: 200,
                }}
                options={getStatusesOptions()}
            />
            <Tooltip placement="top" title="כדי שנות סטטוסים של מכשירים יש לסנן לפי סטטוס" arrow={true}>
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
