const router = require("express").Router();
const projectController = require("../controllers/ProjectController");

router.get("/", projectController.getAllProjects);

router.get("/:id", projectController.getProjectById);

router.get("/get-all-products-in-project/:id", projectController.getAllProductsInProject);

router.get("/find-by-name/:projectName", projectController.getProjectByName);

router.get("/get-all-products-in-lab/:id", projectController.getAllProductsInLab);

router.post("/add-new-project", projectController.addNewProject);

router.patch("/update-project/:id", projectController.updateProject);

router.patch("/close-project/:id", projectController.closeProject)

router.patch("/open-old-project/:id", projectController.openOldProject)

router.delete("/delete-project/:id", projectController.deleteProject)
module.exports = router;
