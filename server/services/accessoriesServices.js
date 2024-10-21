const Accessory = require("../models/Accessory");
const { DeviceStatus } = require("../constants/DeviceStatus");

exports.findAllAccessories = async () => await Accessory.find();
exports.findAccessoriesById = async (AccessoriesId) => await Accessory.findById(AccessoriesId);
exports.addNewAccessories = async (request) => {
    return new Accessory({
        deviceTypeId: request.checkDeviceTypeId,
        unit: request.checkUnitId,
        quantity: request.checkQuantity,
        voucherIn: request.checkVoucherId,
        project: request.projectId,
    });
};

exports.updateStatus = async (request) => {
    const data = await Accessory.findByIdAndUpdate(request.checkAccessoryId, {
        status: request.checkStatus,
    });
    return data;
};

exports.updateReturnAccessory = async (request) => {
    const { id, voucherId, status } = request;

    return await Accessory.findByIdAndUpdate(id, {
        voucherOut: voucherId,
        status: status,
    });
};

exports.updateNotes = async (request) => {
    const data = await Accessory.findByIdAndUpdate(request.checkAccessoryId, {
        notes: request.checkNotes,
    });
    return data;
};

exports.updateFixDefective = async (request) => {
    const data = await Accessory.findByIdAndUpdate(request.checkAccessoryId, {
        fix: request.checkFix,
        defective: request.checkDefective,
    });
    return data;
};

exports.deleteAccessoryById = async (checkAccessoryId) => await Accessory.findByIdAndDelete(checkAccessoryId);

exports.checkVoucherOutInAccessory = async (AccessoryId) => {
    const accessory = Accessory.findById(AccessoryId);
    if (accessory.voucherOut) return true;
    return false;
};

exports.findAllAccessoriesToDashboard = async () =>
    await Accessory.find()
        .sort({ status: 1 })
        .populate("unit")
        .populate("voucherIn")
        .populate("voucherOut")
        .populate("project")
        .populate("deviceTypeId");
