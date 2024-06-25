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

exports.deleteAccessoriesById = async (checkAccessoriesId) => await Accessory.findByIdAndRemove(checkAccessoriesId);

exports.updateStatus = async (request) => {

    const data = await Accessory.findByIdAndUpdate(request.checkAccessoryId, {
        status: request.checkStatus,
    });
    return data;

};

exports.updateNotes = async(request) => {
    const data = await Accessory.findByIdAndUpdate(request.checkAccessoryId, {
        notes: request.checkNotes,
    });
    return data;
}

exports.updateFixDefective = async(request) => {
    const data = await Accessory.findByIdAndUpdate(request.checkAccessoryId, {
        fix: request.checkFix,
        defective: request.checkDefective,
    });
    return data;
}
