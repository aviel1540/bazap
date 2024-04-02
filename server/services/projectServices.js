const Project = require("../models/Project");

exports.addNewProject = async (checkProjectName) => {
    return new Project({
        projectName: checkProjectName,
    });
};
exports.findAllProjects = async () =>
    await Project.find().populate({
        path: "vouchersList",
        populate: {
            path: "deviceList",
            model: "Device",
        },
    });

exports.findProjectById = async (checkProjectId) =>
    await Project.findById(checkProjectId).populate({
        path: "vouchersList",
        populate: {
            path: "unit",
            model: "Units",
        },
    });

exports.findProjectByName = async (projectName) => await Project.findOne({ projectName });

exports.updateProjectDetails = async (request) => {
    const { checkProjectId, checkProjectName } = request;
    return await Project.findByIdAndUpdate(checkProjectId, {
        projectName: checkProjectName,
    });
};

exports.updateDateToClose = async(projectId) => {
    return await Project.findByIdAndUpdate(projectId, {
        endDate: Date.now(),
        finished: true
    })
}
