const router = require("express").Router();
const voucherController = require("../controllers/VoucherController");
module.exports = router;

router.get("/:id", voucherController.getVoucherById);

router.get("/find-all-vouchers/:projectId", voucherController.getAllVouchersInProject);

router.post("/add-new-voucher-in/:projectId", voucherController.addNewVoucherIn);

router.post("/add-new-voucher-out/:projectId" , voucherController.addNewVoucherOut);

router.patch("/update-voucher-devices/:voucherId", voucherController.updateVoucherDevices);

router.delete("/delete/:id", voucherController.deleteVoucher);
