const router = require("express").Router();
const deviceController = require("../controllers/DeviceController");

router.get("/:id", deviceController.getDeviceById);
router.get("/get-all-arrived-devices-in-project/:id", deviceController.getAllArrivedDevicesInProject);

router.get("/find-by-serialNumber/:serialnumber", deviceController.getDeviceBySerialNumber);

router.post("/add-new-device", deviceController.addNewDevice);

router.post("/add-new-devices", deviceController.addNewDevices);

router.patch("/update-status/:id", deviceController.changeStatus);

router.patch("/update-report/:id", deviceController.statusChangeToFinish);

module.exports = router;
