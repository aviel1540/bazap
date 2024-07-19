const router = require("express").Router();
const passwordController = require("../controllers/PasswordController");

router.get("/get-admin-password", passwordController.getAdminPassword);

router.post("/validate-password", passwordController.validatePassword);

router.patch("/update-admin-password", passwordController.updateAdminPassword);

router.post("/login", passwordController.login);

router.post("/logout", passwordController.logout);

router.get("/is-admin-authenticated", passwordController.isAdminAuthenticated);

module.exports = router;
