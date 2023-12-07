const Device = require("../models/Device");

exports.findDeviceById = async (DeviceId) => await Device.findById(DeviceId);
exports.findDeviceBySerialNumber = async (serialNumber) => await Device.findOne({ serialNumber });
exports.findAllDevices = async () => await Device.find();

exports.addNewDevice = async (request) => {
    return new Device({
        serialNumber: request.checkSerialNumber,
        category: request.checkCategory,
        type: request.checkType,
    });
};

exports.updateDeviceDatailsInFinish = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        place: request.checkPlace,
        status: request.checkStatus,
        endDate: new Date(),
        fixedBy: request.checkFixedBy,
        notes: request.checkNotes,
    });
};

exports.updateStatusStart = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        place: request.checkPlace,
        startDate: new Date(),
    });
};

exports.updateStatusEnd = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        place: request.checkPlace,
        endDate: new Date(),
    });
};

exports.updateStatusReturn = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        place: request.checkPlace,
        returnDate: new Date(),
    });
};
