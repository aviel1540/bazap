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
    try {
        console.log(request);
        const data =  await Accessory.findByIdAndUpdate(request.checkAccessoryId, {
            status: request.checkStatus,
        });
        console.log(data);

        return data;
    } catch (error) {
        console.log(error);
    }
};
