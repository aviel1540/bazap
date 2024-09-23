import * as XLSX from "xlsx";

export const downloadTemplateFile = () => {
    const data = [["צ' מכשיר", "סוג מכשיר"]];
    createExcel(data, "קובץ_לדוגמא");
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
                deviceType: row[deviceTypeIndex] ? String(row[deviceTypeIndex]) : null,
            });
        }
    });
    return devices;
};


export const createExcel = (data, name) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    wb.Workbook = {
        Views: [{ RTL: true }],
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(excelBlob);
    link.setAttribute("download", `${name}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
