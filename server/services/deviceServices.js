const Device = require("../models/Device");
const { DeviceStatus } = require("../constants/DeviceStatus");



exports.findDeviceById = async (DeviceId) => await Device.findById(DeviceId);
exports.findDeviceBySerialNumber = async (serialNumber) => await Device.findOne({ serialNumber });
exports.findAllDevices = async () => await Device.find();
exports.findAllDevicesByProject = async (projectId) => await Device.find({ project: projectId }).populate("unit");
exports.addNewDevice = async (request) => {
    return new Device({
        serialNumber: request.checkSerialNumber,
        deviceType: request.checkType,
        unit: request.checkUnitId,
        voucherIn: request.checkVoucherId,
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

exports.updateStatus = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        status: request.checkStatus,
    });
};

exports.updateStatusEnd = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        status: request.checkPlace,
        endDate: new Date(),
    });
};

exports.updateStatusReturn = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        status: request.checkPlace,
        returnDate: new Date(),
    });
};

exports.updateReturnDevice = async (request) => {
    const { deviceId, checkVoucherId, deviceStatus } = request;
    console.log(deviceId)
    return await Device.findByIdAndUpdate(deviceId, {
        voucherOut: checkVoucherId,
        status: deviceStatus == DeviceStatus.DEFECTIVE ? DeviceStatus.DEFECTIVE_RETURN : DeviceStatus.FIXED_RETURN,
    })
}
