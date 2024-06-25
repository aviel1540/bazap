const Device = require("../models/Device");
const { DeviceStatus } = require("../constants/DeviceStatus");

exports.findDeviceById = async (DeviceId) => await Device.findById(DeviceId);
exports.findDeviceBySerialNumber = async (serialNumber) => await Device.findOne({ serialNumber });
exports.findAllDevices = async () => await Device.find();
exports.addNewDevice = async (request) => {
    return new Device({
        serialNumber: request.checkSerialNumber,
        deviceTypeId: request.checkDeviceTypeId,
        unit: request.checkUnitId,
        voucherIn: request.checkVoucherId,
        project: request.projectId,
    });
};

exports.updateStatus = async (request) => {
    return await Device.findByIdAndUpdate(request.checkDeviceId, {
        status: request.checkStatus,
    });
};

exports.updateReturnDevice = async (request) => {
    const { deviceId, voucherId, deviceStatus } = request;

    return await Device.findByIdAndUpdate(deviceId, {
        voucherOut: voucherId,
        status: deviceStatus == DeviceStatus.DEFECTIVE ? DeviceStatus.DEFECTIVE_RETURN : DeviceStatus.FIXED_RETURN,
    });
};

exports.deleteDeviceById = async (checkDeviceId) => await Device.findByIdAndRemove(checkDeviceId);

exports.updateDeviceNote = async (request) => {
    const { checkDeviceId, checkNote } = request;

    return await Device.findByIdAndUpdate(checkDeviceId, {
        notes: checkNote,
    });
};
