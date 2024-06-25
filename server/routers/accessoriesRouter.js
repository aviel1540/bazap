const router = require("express").Router();
const accessoryController = require("../controllers/AccessoriesController");


router.get("/", accessoryController.getAllAccessories);

router.get("/get-acessory-by-id/:id" , accessoryController.getAccessory)

router.patch("/update-status/:id", accessoryController.updateStatus);

router.patch("/update-notes/:id", accessoryController.updateNote);

router.patch("/update-fix-defective/:id", accessoryController.updateFixDefective);


module.exports = router;
