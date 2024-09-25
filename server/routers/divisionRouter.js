const router = require("express").Router();
const divisionController = require("../controllers/DivisionController")

router.get("/", divisionController.getAllDivisions);

router.get("/get-division-by-id/:id" , divisionController.getDivision)

router.post("/add-new-division/", divisionController.addNewDivision)

router.patch("/update-division-name/:id", divisionController.updateDivisionName);

router.delete("/delete-division/:id", divisionController.deleteDivision);





module.exports = router;
