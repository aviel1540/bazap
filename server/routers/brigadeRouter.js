const router = require("express").Router();
const brigadeController = require("../controllers/BrigadeController");

router.get("/", brigadeController.getAllBrigades);

router.get("/get-brigade-by-id/:brigadeId", brigadeController.getBrigadeById);

router.post("/add-new-brigade/:divisionId", brigadeController.addNewBrigade);

// router.patch("/update-brigade-name/:brigadeId", brigadeController.updateBrigadeName);

router.delete("/delete-brigade/:brigadeId", brigadeController.deleteBrigade);


module.exports = router;
