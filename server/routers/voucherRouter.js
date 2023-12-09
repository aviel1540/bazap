const router = require("express").Router();
const voucherController = require("../controllers/VoucherController");
module.exports = router;


router.get("/find-all-vouchers/:projectId", voucherController.getAllVouchersInProject);

router.post("/add-new-voucher/:projectId", voucherController.addNewVoucher);
