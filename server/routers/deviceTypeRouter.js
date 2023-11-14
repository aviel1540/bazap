const router = require("express").Router();
const deviceTypeController = require("../controllers/DeviceTypeController");

router.get("/",deviceTypeController.getAllDeviceTypes);

router.post("/add-new-deviceType", deviceTypeController.addNewDeviceType);


module.exports = router