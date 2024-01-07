const router = require("express").Router();
const technicianController = require("../controllers/TechnicianController");

router.get("/", technicianController.getAllTechnicians);

router.post("/add-new-technician", technicianController.addNewTechnician);

router.delete("/delete-technician", technicianController.deleteTechnician);

module.exports = router;
