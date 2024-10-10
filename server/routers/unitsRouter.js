const router = require("express").Router();
const unitsController = require("../controllers/UnitsController");

router.get("/", unitsController.getAllUnits);

router.get("/find-by-name/:unitName", unitsController.getUnitByName);

router.get("/:id", unitsController.getUnitById);

router.post("/add-new-unit/:brigadeId", unitsController.addNewUnit);

router.patch("/update-unit/:id", unitsController.updateUnitDetailes);

router.delete("/delete/:id", unitsController.deleteUnits);

module.exports = router;
