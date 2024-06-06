import { Table, Tag } from "antd";
import PropTypes from "prop-types";
import { DeviceStatuses, FIXED_OR_DEFFECTIVE, RETURNED, addKeysToArray, tagColors } from "../../../../Utils/utils";
import Loader from "../../../../Components/Layout/Loader";
import EmptyData from "../../../../Components/UI/EmptyData";

const DevicesInProjectTable = ({ rowSelection, filteredDevices, additionalColumns, defaultPageSize, isLoading, handleStatusChange }) => {
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
    const columns = [
        {
            title: "צ' מכשיר",
            dataIndex: "serialNumber",
            key: "serialNumber",
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
            render: ({ deviceTypeId }) => deviceTypeId.deviceName,
            sorter: (a, b) => a.deviceType.length - b.deviceType.length,
            sortDirections: ["descend"],
        },
        { ...additionalColumns },
    ];
    if (isLoading) {
        return <Loader />;
    }
    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין מכשירים להצגה" /> }}
            rowSelection={rowSelection}
            dataSource={addKeysToArray(filteredDevices, "key", "_id")}
            pagination={paginationOptions}
            columns={columns}
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
