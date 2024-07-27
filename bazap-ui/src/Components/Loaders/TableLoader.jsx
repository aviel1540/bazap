import PropTypes from "prop-types";
import { Table, Skeleton } from "antd";

const TableLoader = ({ columns }) => {
    // Create skeleton columns without custom renderers
    const skeletonColumns = columns.map((column) => ({
        ...column,
        render: column.dataIndex ? () => <Skeleton.Input active={true} size="small" /> : column.render,
    }));

    // Generate loading data
    const loadingData = Array.from({ length: 3 }).map((_, index) => {
        const row = {};
        columns.forEach((column) => {
            if (column.dataIndex) {
                row[column.dataIndex] = <Skeleton.Input active={true} size="small" />;
            }
        });
        return { key: index, ...row };
    });

    return <Table columns={skeletonColumns} dataSource={loadingData} pagination={false} />;
};

TableLoader.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            dataIndex: PropTypes.string,
            key: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default TableLoader;
