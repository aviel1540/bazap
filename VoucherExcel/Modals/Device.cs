using VoucherExcel.Attributes;

namespace VoucherExcel.Modals
{
	public class Device
	{
		[Voucher(rowPosition: 0, columnPosition: "D")]
		public string? SerialNumber { get; set; }
		[Voucher(rowPosition: 0, columnPosition: "E")]
		public string? DeviceType { get; set; }
		[Voucher(rowPosition: 0, columnPosition: "G")]
		public string? CatalogNumber { get; set; }
		[Voucher(rowPosition: 0, columnPosition: "I")]
		public string? Notes { get; set; }
	}
}
