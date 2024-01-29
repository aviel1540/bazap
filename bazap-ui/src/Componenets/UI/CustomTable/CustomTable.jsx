import DataTable from "react-data-table-component";

const CustomTable = (props) => {
    return <DataTable noDataComponent="אין רשומות להצגה" direction="rtl" selectableRowsVisibleOnly className="table" {...props} />;
};

export default CustomTable;
