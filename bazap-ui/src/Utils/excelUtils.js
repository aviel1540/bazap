import * as XLSX from "xlsx";

export const downloadTemplateFile = () => {
    const data = [["צ' מכשיר", "סוג מכשיר"]];

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Add a worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Add RTL orientation setting to the workbook
    wb.Workbook = {
        Views: [{ RTL: true }],
    };

    // Convert the workbook to a binary XLSX file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Create a download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(excelBlob);
    link.setAttribute("download", "excel_data.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const readDevicesExcelFile = (rows) => {
    if (rows.length == 0) {
        throw new Error("קובץ בפורמט הלא נכון");
    }
    const devices = [];
    const serialIndex = rows[0].indexOf("צ' מכשיר");
    const deviceTypeIndex = rows[0].indexOf("סוג מכשיר");
    rows.forEach(function (row, index) {
        if (index > 0) {
            devices.push({
                serialNumber: String(row[serialIndex]),
                deviceType: String(row[deviceTypeIndex]),
            });
        }
    });
    return devices;
};
