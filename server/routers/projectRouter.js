const router = require("express").Router();
const projectController = require("../controllers/ProjectController");

router.get("/", projectController.getAllProjects);

router.get("/:id", projectController.getProjectById);

router.get("/find-by-name/:projectName", projectController.getProjectByName);

router.post("/add-new-project", projectController.addNewProject);

router.patch("/update-project/:id", projectController.updateProject)

module.exports = router