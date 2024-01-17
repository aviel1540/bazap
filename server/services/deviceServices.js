const Device = require("../models/Device");

exports.findDeviceById = async (DeviceId) => await Device.findById(DeviceId);
exports.findDeviceBySerialNumber = async (serialNumber) => await Device.findOne({ serialNumber });
exports.findAllDevices = async () => await Device.find();
exports.findAllDevicesByProject = async (projectId) => await Device.find({ project: projectId }).populate("voucherNumber").populate("unit");

exports.addNewDevice = async (request) => {
    return new Device({
        serialNumber: request.checkSerialNumber,
        deviceType: request.checkType,
        unit: request.checkUnitId,
        voucherNumber: request.checkVoucherId,
        project: request.projectId,
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
    Device.create;
};

exports.updateStatusReturn = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        place: request.checkPlace,
        returnDate: new Date(),
    });
};
