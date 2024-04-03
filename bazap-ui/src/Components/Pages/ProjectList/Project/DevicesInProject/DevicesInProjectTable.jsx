import EmptyData from "../../../../UI/EmptyData";
import { Table, Tag } from "antd";
import { DeviceStatuses, FIXED_OR_DEFFECTIVE, RETURNED, addKeysToArray, replaceApostrophe, tagColors } from "../../../../../Utils/utils";
import PropTypes from "prop-types";
import Loader from "../../../../Layout/Loader";

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
                    <Tag color={tagColors[status]} onClick={() => handleTagClick(status)} style={{ cursor: "pointer" }}>
                        {status}
                    </Tag>
                    {/* {handleStatusChange == undefined && <Tag color={tagColors[status]}>{status}</Tag>} */}
                    {/* {handleStatusChange != undefined && (
                        <Tag.CheckableTag color={tagColors[status]} onChange={() => handleStatusChange(status)}>
                            {status}
                        </Tag.CheckableTag>
                    )} */}
                </>
            ),
        },
        {
            title: "סוג מכשיר",
            dataIndex: "deviceType",
            render: (_, row) => replaceApostrophe(row.deviceType),
            key: "deviceType",
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
