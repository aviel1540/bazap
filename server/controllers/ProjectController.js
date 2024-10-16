const escape = require("escape-html");
const validation = require("../utils/validation");
const projectService = require("../services/projectServices");
const deviceService = require("../services/deviceServices");

exports.addNewProject = async (req, res) => {
    const projectName = escape(req.body.projectName);
    let newProject;
    try {
        if (!projectName) return res.status(400).json({ message: "נא למלא את כל השדות." });

        const checkProjectName = validation.addSlashes(projectName);
        newProject = await projectService.addNewProject(checkProjectName);
        await newProject.save();
        return res.status(200).json({ message: "פרוייקט נוצר בהצלחה!", newProject });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

exports.getAllProjects = async (req, res) => {
    let project;
    try {
        project = await projectService.findAllProjects();
        if (!project) {
            return res.status(404).json({ message: "לא קיימים פרוייקטים" });
        }
        return res.status(200).json(project);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getProjectById = async (req, res) => {
    const projectId = escape(req.params.id);
    let project;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);
        return res.status(200).json(project);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getProjectByName = async (req, res) => {
    const projectName = escape(req.params.projectName);

    let project;
    try {
        const checkProjectName = validation.addSlashes(projectName);
        project = await projectService.findProjectByName(checkProjectName);
        if (!project) return res.status(404).json({ message: "לא קיים פרויקט." });
        return res.status(200).json(project);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.updateProject = async (req, res) => {
    const projectId = escape(req.params.id);
    const projectName = escape(req.body.projectName);

    let updateProject;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        const checkProjectName = validation.addSlashes(projectName);

        updateProject = await projectService.updateProjectDetails({
            checkProjectId,
            checkProjectName,
        });
        if (!updateProject) {
            return res.status(404).json({ message: "לא נמצא פרויקט ." });
        }
        await updateProject.save();
        res.status(200).json({ message: "הפרויקט עודכן בהצלחה." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.closeProject = async (req, res) => {
    const projectId = escape(req.params.id);
    console.log(projectId);
    let project;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);
        if (project.vouchersList.length == 0) {
            return res.status(400).json({ message: "לא ניתן לסגור פרוייקט ריק" });
        }

        const checkIfDevicesInLab = await projectService.findAllDevicesInLab(projectId);
        if (checkIfDevicesInLab.length > 0) {
            return res.status(400).json({ message: "לא ניתן לסגור - קיימים מכשירים במעבדה" });
        }

        const checkIfAccessoriesInLab = await projectService.findAllAccessoriesInLab(projectId);
        if (checkIfAccessoriesInLab.length > 0) {
            return res.status(400).json({ message: "לא ניתן לסגור - קיימים צלמ במעבדה" });
        }

        project = await projectService.updateDateToClose(projectId);
        if (!project) {
            return res.status(401).json({ message: "לא נמצא פרויקט" });
        }
        await project.save();
        return res.status(201).json({ message: "Success" });
    } catch (err) {
        return res.status(500).json({ message: "Failed" });
    }
};

exports.openOldProject = async (req, res) => {
    const projectId = escape(req.params.id);
    let project;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);

        await projectService.updateDateToRestart(checkProjectId);
        return res.status(200).json({ message: "הפרויקט נפתח בהצלחה " });
    } catch (err) {
        return res.status(500).json({ message: message.err });
    }
};

exports.deleteProject = async (req, res) => {
    const projectId = escape(req.params.id);
    let project;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);
        if (project.vouchersList.length > 0) {
            return res.status(400).json({ message: "לא ניתן לסגור קיימים  שוברים" });
        }
        await projectService.deleteProjectById(checkProjectId);

        return res.status(200).json({ message: "מחיקה בוצעה בהצלחה !" });
    } catch (err) {
        return res.status(500).json({ message: message.err });
    }
};

exports.getAllProductsInProject = async (req, res) => {
    try {
        const projectId = escape(req.params.id);
        const devices = await projectService.findAllDevicesByProject(projectId);
        const accessories = await projectService.findAllAccessoriesByProject(projectId);
        let products = [];
        if (devices.length > 0) {
            devices.map((device) => {
                products.push(device);
            });
        }
        if (accessories.length > 0) {
            accessories.map((acc) => {
                products.push(acc);
            });
        }
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAllProductsInLab = async (req, res) => {
    try {
        const projectId = escape(req.params.id);
        const devices = await projectService.findAllDevicesInLab(projectId);
        const accessories = await projectService.findAllAccessoriesInLab(projectId);
        console.log(accessories);
        let products = [];
        if (devices.length > 0) {
            devices.map((device) => {
                products.push(device);
            });
        }
        if (accessories.length > 0) {
            accessories.map((acc) => {
                products.push(acc);
            });
        }
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
