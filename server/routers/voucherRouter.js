const router = require("express").Router();
const voucherController = require("../controllers/VoucherController");
module.exports = router;

router.get("/:id", voucherController.getVoucherById);

router.get("/find-all-vouchers/:projectId", voucherController.getAllVouchersInProject);

router.post("/add-new-voucher/:projectId", voucherController.addNewVoucherIn);

router.delete("/delete/:id", voucherController.deleteVoucher);
