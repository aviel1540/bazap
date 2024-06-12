using Microsoft.AspNetCore.Mvc;
using VoucherExcel.Helpers;
using VoucherExcel.Modals;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VoucherExcel.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ExcelExportController : ControllerBase
	{
		// POST api/ExcelExpor
		[HttpPost]
		public FileResult Post(Voucher voucher)
		{
			return ExcelExportHelper.ExportToExcel(this, voucher);
		}

	}
}
