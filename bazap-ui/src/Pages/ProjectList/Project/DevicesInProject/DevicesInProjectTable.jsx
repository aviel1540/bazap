import { Table, Tag, Typography } from "antd";
import PropTypes from "prop-types";
import { DeviceStatuses, FIXED_OR_DEFFECTIVE, RETURNED, addKeysToArray, tagColors } from "../../../../Utils/utils";
import Loader from "../../../../Components/Layout/Loader";
import EmptyData from "../../../../Components/UI/EmptyData";
import { useQuery } from "@tanstack/react-query";
import { getAllUnits } from "../../../../Utils/unitAPI";
const { Text } = Typography;
const DevicesInProjectTable = ({ rowSelection, filteredDevices, additionalColumns, defaultPageSize, isLoading, handleStatusChange }) => {
    const { data: units, isLoading: isUnitsLoading } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const paginationOptions = {
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "25", "50"],
        defaultPageSize: defaultPageSize ? defaultPageSize : 10,
        locale: {
            items_per_page: "/ עמוד",
        },
        showTotal: (total, range) => `${range[0]}-${range[1]} מתוך ${total} מכשירים`,
    };
    const handleTagClick = (status) => {
        if ([DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN].includes(status)) {
            handleStatusChange(RETURNED);
            return;
        }
        if ([DeviceStatuses.FIXED, DeviceStatuses.DEFECTIVE].includes(status)) {
            handleStatusChange(FIXED_OR_DEFFECTIVE);
            return;
        }
        handleStatusChange(status);
        return;
    };

    const columns = () => [
        {
            title: "צ' מכשיר",
            dataIndex: "serialNumber",
            key: "serialNumber",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "יחידה",
            dataIndex: "unit",
            key: "unit",
            filters: units.map((unit) => {
                return { text: unit.unitsName, value: unit._id };
            }),
            onFilter: (value, record) => record.unit._id == value,
            sorter: (a, b) => a?.unit?.unitsName.length - b?.unit?.unitsName.length,
            render: (unit) => unit?.unitsName,
        },
        {
            title: "סטטוס",
            dataIndex: "status",
            key: "status",
            render: (_, { status }) => (
                <>
                    {handleStatusChange == undefined && <Tag color={tagColors[status]}>{status}</Tag>}
                    {handleStatusChange != undefined && (
                        <Tag color={tagColors[status]} onClick={() => handleTagClick(status)} style={{ cursor: "pointer" }}>
                            {status}
                        </Tag>
                    )}
                </>
            ),
            sorter: (a, b) => a.status.length - b.status.length,
            sortDirections: ["descend"],
        },
        {
            title: "סוג מכשיר",
            key: "deviceType",
            render: ({ deviceTypeId }) => deviceTypeId?.deviceName,
            sorter: (a, b) => a.deviceType.deviceName?.length - b.deviceType?.deviceName.length,
            sortDirections: ["descend"],
        },
        { ...additionalColumns },
    ];
    if (isLoading || isUnitsLoading) {
        return <Loader />;
    }
    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין מכשירים להצגה" /> }}
            rowSelection={rowSelection}
            dataSource={addKeysToArray(filteredDevices, "key", "_id")}
            pagination={paginationOptions}
            columns={columns()}
        />
    );
};

DevicesInProjectTable.propTypes = {
    rowSelection: PropTypes.object,
    filteredDevices: PropTypes.array,
    additionalColumns: PropTypes.object,
    defaultPageSize: PropTypes.number,
    isLoading: PropTypes.bool,
    handleStatusChange: PropTypes.func,
};
export default DevicesInProjectTable;
