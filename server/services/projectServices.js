const Project = require("../models/Project");

exports.addNewProject = async(request) => {
    return new Project({
        projectName: request.checkProjectName,
        unit: request.checkUnit
    });
}