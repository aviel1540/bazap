const router = require("express").Router();
const unitsController = require("../controllers/UnitsController");


router.get("/", unitsController.getAllUnits);

router.get("/find-by-name/:unitName", unitsController.getUnitByName);

router.post("/add-new-unit", unitsController.addNewUnit);

module.exports = router