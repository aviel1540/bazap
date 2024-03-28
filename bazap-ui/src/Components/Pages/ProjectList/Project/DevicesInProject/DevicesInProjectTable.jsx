import EmptyData from "../../../../UI/EmptyData";
import { Table, Tag } from "antd";
import { addKeysToArray, replaceApostrophe, tagColors } from "../../../../../Utils/utils";
import PropTypes from "prop-types";
import Loader from "../../../../Layout/Loader";

const DevicesInProjectTable = ({ rowSelection, filteredDevices, additionalColumns, defaultPageSize, isLoading }) => {
    const paginationOptions = {
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "25", "50"],
        defaultPageSize: defaultPageSize ? defaultPageSize : 10,
        locale: {
            items_per_page: "/ עמוד",
        },
        showTotal: (total, range) => `${range[0]}-${range[1]} מתוך ${total} מכשירים`,
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
            render: (_, { status }) => <Tag color={tagColors[status]}>{status}</Tag>,
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
};
export default DevicesInProjectTable;
