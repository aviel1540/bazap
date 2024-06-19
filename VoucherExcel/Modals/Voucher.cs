using VoucherExcel.Attributes;

namespace VoucherExcel.Modals
{
	public class Voucher
	{
		[Voucher(rowPosition: 3, columnPosition: "C")]
		public string? Project { get; set; }

		[Voucher(rowPosition: 2, columnPosition: "A")]
		public string? IssuingUnit { get; set; }
		[Voucher(rowPosition: 2, columnPosition: "E")]
		public string? ReceivingUnit { get; set; }
		[Voucher(rowPosition: 2, columnPosition: "I")]
		public DateTime? Date { get; set; }
		[Voucher(rowPosition: 2, columnPosition: "K")]
		public string? VoucherNumber { get; set; }

		[Voucher(rowPosition: 6, columnPosition: "D")]
		public List<Device>? Devices { get; set; }
		[Voucher(rowPosition: 31, columnPosition: "C")]
		public string? IssuingTechnician { get; set; }
		[Voucher(rowPosition: 31, columnPosition: "J")]
		public string? ReceivingTechnician { get; set; }

	}
}
