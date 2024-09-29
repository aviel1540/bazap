const Device = require("../models/Device");
const Project = require("../models/Project");
const Accessories = require("../models/Accessory");
const { DeviceStatus } = require("../constants/DeviceStatus");

exports.addNewProject = async (checkProjectName) => {
    return new Project({
        projectName: checkProjectName,
    });
};
exports.findAllProjects = async () =>
    await Project.find().populate({
        path: "vouchersList",
        populate: [
            { path: "deviceList", model: "Device" },
            { path: "accessoriesList", model: "Accessories" },
        ],
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

exports.updateDateToClose = async (projectId) => {
    return await Project.findByIdAndUpdate(projectId, {
        endDate: Date.now(),
        finished: true,
    });
};

exports.updateDateToRestart = async (projectId) => {
    return await Project.findByIdAndUpdate(projectId, {
        endDate: null,
        finished: false,
    });
};

exports.deleteProjectById = async (projectId) => await Project.findByIdAndRemove(projectId);

exports.findAllAccessoriesByProject = async (projectId) =>
    await Accessories.find({ project: projectId }).populate("unit").populate("deviceTypeId").populate("voucherIn").populate("voucherOut");

exports.findAllAccessoriesInLab = async (projectId) =>
    await Accessories.find({
        project: projectId,
        status: { $in: [DeviceStatus.AT_WORK, DeviceStatus.WAIT_TO_WORK] },
    })
        .populate("unit")
        .populate("deviceTypeId");

exports.findAllDevicesByProject = async (projectId) =>
    await Device.find({ project: projectId }).populate("unit").populate("deviceTypeId").populate("voucherIn").populate("voucherOut");

exports.findAllDevicesInLab = async (projectId) =>
    await Device.find({ project: projectId, voucherOut: null }).populate("deviceTypeId").populate("unit");
