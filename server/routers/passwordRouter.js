const router = require("express").Router();
const passwordController = require("../controllers/PasswordController");

router.get("/get-admin-password", passwordController.getAdminPassword);

router.get("/validate-password", passwordController.validatePassword);

router.patch("/update-admin-password" , passwordController.updateAdminPassword);


module.exports = router;
