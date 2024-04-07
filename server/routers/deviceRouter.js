const router = require("express").Router();
const deviceController = require("../controllers/DeviceController");

router.get("/", deviceController.getAllDevices);
router.get("/:id", deviceController.getDeviceById);
router.get("/get-all-devices-in-project/:id", deviceController.getAllDevicesInProject);

router.get("/find-by-serialNumber/:serialnumber", deviceController.getDeviceBySerialNumber);

router.post("/add-new-devices", deviceController.addNewDevices);

router.patch("/update-status/:id", deviceController.changeStatus);

router.post("/return-device/:id", deviceController.returnDevice);

router.get("/get-all-devices-in-lab/:id", deviceController.getAllDevicesInLab);

router.delete("/delete-device/:id", deviceController.deleteDevice)

module.exports = router;
