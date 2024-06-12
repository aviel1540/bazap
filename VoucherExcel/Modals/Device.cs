using VoucherExcel.Attributes;

namespace VoucherExcel.Modals
{
	public class Device
	{
		[Voucher(rowPosition: 0, columnPosition: "B")]
		public string? SerialNumber { get; set; }
		[Voucher(rowPosition: 0, columnPosition: "D")]
		public string? DeviceType { get; set; }
		[Voucher(rowPosition: 0, columnPosition: "E")]
		public string? CatalogNumber { get; set; }
	}
}
