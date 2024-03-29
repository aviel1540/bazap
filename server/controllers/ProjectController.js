const projectService = require("../services/projectServices");
const escape = require("escape-html");
const validation = require("../utils/validation");

exports.addNewProject = async (req, res) => {
    const projectName = escape(req.body.projectName);
    let newProject;
    try {
        if (!projectName) return res.status(400).json({ message: "נא למלא את כל השדות." });

        const checkProjectName = validation.addSlashes(projectName);
        newProject = await projectService.addNewProject(checkProjectName);
        await newProject.save();
        return res.status(200).json(newProject);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

exports.getAllProjects = async (req, res) => {
    let project;
    let details;
    let projects = [];
    try {
        project = await projectService.findAllProjects();
        if (!project) {
            return res.status(404).json({ message: "לא קיימים פרוייקטים" });
        }
        // project.map(pr => {
        //     details = {
        //         id: pr._id,
        //         name: pr.projectName,
        //         startDate: pr.startDate
        //     }
        //     projects.push(details);
        // })
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
