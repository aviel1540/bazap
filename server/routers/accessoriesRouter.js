const router = require("express").Router();
const accessoryController = require("../controllers/AccessoriesController");


router.get("/", accessoryController.getAllAccessories);

router.get("/get-acessory-by-id/:id" , accessoryController.getAccessory)

router.patch("/update-status/:id", accessoryController.updateStatus);

module.exports = router;
