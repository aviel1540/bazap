import DataTable from "react-data-table-component";
import propTypes from "prop-types";

const CustomTable = ({ data, columns, options }) => {
    return (
        <DataTable
            noDataComponent="אין רשומות להצגה" //or your component
            className="table"
            columns={columns}
            data={data}
            {...options}
        />
    );
};

CustomTable.propTypes = {
    data: propTypes.array.isRequired,
    columns: propTypes.array.isRequired,
    options: propTypes.object,
};

export default CustomTable;
