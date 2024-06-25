const Accessories = require("../models/Accessory");
const { DeviceStatus } = require("../constants/DeviceStatus");

exports.findAllAccessories = async () => await Accessories.find();
exports.findAccessoriesById = async (AccessoriesId) => await Accessories.findById(AccessoriesId);
exports.addNewAccessories = async (request) => {
    return new Accessories({
        deviceTypeId: request.checkDeviceTypeId,
        unit: request.checkUnitId,
        quantity: request.checkQuantity,
        voucherIn: request.checkVoucherId,
        project: request.projectId,
    });
};

exports.deleteAccessoriesById = async (checkAccessoriesId) => await Accessories.findByIdAndRemove(checkAccessoriesId);

exports.changeStatus = async(request) => {
    return await Accessories.findByIdAndUpdate(request.checkAccessoriesId, {
        status: request.checkStatus,
    });
};
