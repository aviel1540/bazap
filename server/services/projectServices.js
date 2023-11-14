const Project = require("../models/Project");

exports.addNewProject = async (checkProjectName) => {
    return new Project({
        projectName: checkProjectName
    });
}
exports.findAllProjects = async () => await Project.find();

exports.findProjectById = async (checkProjectId) => await Project.findById(checkProjectId);

exports.findProjectByName = async (projectName) =>
    await Project.findOne({ projectName });

exports.updateProjectDetails = async (request) => {
    const { checkProjectId, checkProjectName } = request;
    return await Project.findByIdAndUpdate(checkProjectId, {
        projectName: checkProjectName
    })
};