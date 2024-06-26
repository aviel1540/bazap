using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using VoucherExcel.Modals;

namespace VoucherExcel.Helpers
{
    public class ExcelExportHelper
    {
        private static readonly Dictionary<string, (int RowPosition, string ColumnPosition)> voucherPositions = Utils.Utils.GetVoucherPropertyPositions<Voucher>();
        private static readonly Dictionary<string, (int RowPosition, string ColumnPosition)> devicePositions = Utils.Utils.GetVoucherPropertyPositions<Device>();
        private static readonly int devicesPerPage = 20;

        public static FileResult ExportToExcel(ControllerBase controller, Voucher voucher)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            Console.WriteLine("Directory: " + Directory.GetCurrentDirectory());
            string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "source", "shovar.xlsx");

            if (!File.Exists(templatePath))
            {
                return null;
            }

            FileInfo fileInfo = new FileInfo(templatePath);

            using (var package = new ExcelPackage(fileInfo))
            {
                var worksheet = package.Workbook.Worksheets[0];
                int devicesCount = voucher.Devices.Count;
                int pages = (int)Math.Ceiling((double)devicesCount / devicesPerPage);
                voucher.Devices.OrderBy(device => device.DeviceType).ThenBy(device => device.SerialNumber);
                for (int page = 0; page < pages; page++)
                {
                    int startRow = (page * 33) + 1;
                    worksheet.Cells["1:33"].Copy(worksheet.Cells[$"{startRow}:{startRow + 32}"]);
                    FillVoucherInWorksheet(worksheet, voucher, startRow - 1, page + 1, pages);
                }

                var excelData = package.GetAsByteArray();
                return controller.File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "shovar_modified.xlsx");
            }
        }

        private static void FillVoucherInWorksheet(ExcelWorksheet worksheet, Voucher voucher, int startRow, int page, int pages)
        {
            FillCell(worksheet, "Project", voucher.Project, startRow);
            FillCell(worksheet, "IssuingUnit", voucher.IssuingUnit, startRow);
            FillCell(worksheet, "ReceivingUnit", voucher.ReceivingUnit, startRow);
            FillCell(worksheet, "Date", voucher.Date.ToString(), startRow);
            worksheet.Cells[$"K{4 + startRow}"].Value = $"{page}/{pages}";
            FillCell(worksheet, "IssuingTechnician", voucher.IssuingTechnician, startRow);
            FillCell(worksheet, "ReceivingTechnician", voucher.ReceivingTechnician, startRow);
            FillCell(worksheet, "VoucherNumber", voucher.VoucherNumber, startRow);
            FillDevices(worksheet, voucher.Devices.Skip((page - 1) * devicesPerPage).Take(devicesPerPage).ToList(), startRow + 6);
        }

        private static void FillCell(ExcelWorksheet worksheet, string propertyName, object value, int startRow, Dictionary<string, (int RowPosition, string ColumnPosition)> positions = null)
        {
            positions ??= voucherPositions;

            if (positions.TryGetValue(propertyName, out var position))
            {
                int rowPosition = startRow + position.RowPosition;
                string columnPosition = position.ColumnPosition;
                worksheet.Cells[$"{columnPosition}{rowPosition}"].Value = value;
            }
        }

        private static void FillDevices(ExcelWorksheet worksheet, List<Device> devices, int startRow)
        {
            for (int i = 0; i < devices.Count; i++)
            {
                Device device = devices[i];
                FillCell(worksheet, "SerialNumber", device.SerialNumber, startRow + i, devicePositions);
                FillCell(worksheet, "Quantity", device.Quantity, startRow + i, devicePositions);
                FillCell(worksheet, "DeviceType", device.DeviceType, startRow + i, devicePositions);
                FillCell(worksheet, "CatalogNumber", device.CatalogNumber, startRow + i, devicePositions);
                FillCell(worksheet, "Notes", device.Notes, startRow + i, devicePositions);
            }
        }
    }
}
