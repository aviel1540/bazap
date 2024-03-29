const router = require("express").Router();
const deviceController = require("../controllers/DeviceController");

router.get("/", deviceController.getAllDevices);
router.get("/:id", deviceController.getDeviceById);
router.get("/get-all-arrived-devices-in-project/:id", deviceController.getAllArrivedDevicesInProject);

router.get("/find-by-serialNumber/:serialnumber", deviceController.getDeviceBySerialNumber);

router.post("/add-new-devices", deviceController.addNewDevices);

router.patch("/update-status/:id", deviceController.changeStatus);

router.post("/return-device/:id", deviceController.returnDevice);

module.exports = router;
