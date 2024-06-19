namespace VoucherExcel.Attributes
{
	public class VoucherAttribute : Attribute
	{
		public int RowPosition { get; set; }
		public string ColumnPosition { get; set; }

		public VoucherAttribute(int rowPosition, string columnPosition)
		{
			this.RowPosition = rowPosition;
			this.ColumnPosition = columnPosition;

		}
	}

}
