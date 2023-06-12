const router = require("express").Router();
const projectController = require("../controllers/ProjectController");

router.post("/add-new-project", projectController.addNewProject);

router.get("/", projectController.getAllProjects);


module.exports = router