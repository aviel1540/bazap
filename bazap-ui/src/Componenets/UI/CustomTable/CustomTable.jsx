import DataTable from "react-data-table-component";
import propTypes from "prop-types";

const CustomTable = ({ data, columns }) => {
    return (
        <DataTable
            noDataComponent="אין רשומות להצגה" //or your component
            className="table"
            columns={columns}
            data={data}
        />
    );
};

CustomTable.propTypes = {
    data: propTypes.array.isRequired,
    columns: propTypes.array.isRequired,
};

export default CustomTable;
