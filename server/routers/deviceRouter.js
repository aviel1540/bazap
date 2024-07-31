const router = require("express").Router();
const deviceController = require("../controllers/DeviceController");

router.get("/", deviceController.getAllDevices);

router.get("/:id", deviceController.getDeviceById);

router.get("/find-by-serialNumber/:serialnumber", deviceController.getDeviceBySerialNumber);

router.get("/search-by-serialNumber/:serialnumber", deviceController.searchDeviceBySerialNumber);

router.post("/add-new-devices", deviceController.addNewDevices);

router.patch("/update-status/:id", deviceController.changeStatus);

router.patch("/update-note/:id", deviceController.updateNote);

router.post("/return-device/:id", deviceController.returnDevice);

router.delete("/delete-device/:id", deviceController.deleteDevice);

module.exports = router;
