const projectService = require('../services/projectServices');
const escape = require("escape-html");
const validation = require("../utils/validation");


exports.addNewProject = async(req,res) => {
    const projectName = escape(req.body.projectName);
    const unit = escape(req.body.unit);

    let newProject;
    try {
        if(
            !projectName ||
            !unit
        ) {
            return res.status(400).json({ message: "נא למלא את כל השדות." });
        }

        const checkProjectName = validation.addSlashes(projectName);
        const checkUnit = validation.addSlashes(unit);
        console.log(checkUnit)
        newProject = await projectService.addNewProject({
            checkProjectName,
            checkUnit
        })
        await newProject.save();
        return res.status(200).json(newProject);
    } catch(err) {
        return res.status(401).json({ message: err.message });
    }
}

exports.getAllProjects = async(req,res) => {
    let project;
    let details;
    let projects = [];
    try {
        project = await projectService.findAllProjects();
        if(!project) {
            return res.status(404).json({ message: "לא קיימים פרוייקטים"});
        }
        project.map(pr => {
            details = {
                name: pr.projectName,
                unit: pr.unit,
                startDate: pr.startDate
            }
            projects.push(details);
        })
        return res.status(200).json(projects);
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}

exports.updateDetails = async(req,res) => {
    const projectId = escape(req.params.projectId);
    const projectName = escape(req.body.projectName);
    const unit = escape(req.body.unit);
    let projectUpdate
}