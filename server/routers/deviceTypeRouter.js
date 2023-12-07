const router = require("express").Router();
const deviceTypeController = require("../controllers/DeviceTypeController");

router.get("/",deviceTypeController.getAllDeviceTypes);

router.post("/add-new-deviceType", deviceTypeController.addNewDeviceType);

router.delete("/delete-deviceType", deviceTypeController.deleteDeviceType);

module.exports = router