const Device = require("../models/Device");
const { DeviceStatus } = require("../constants/DeviceStatus");

exports.findDeviceById = async (DeviceId) => await Device.findById(DeviceId);
exports.findDeviceBySerialNumber = async (serialNumber) => await Device.findOne({ serialNumber });
exports.findAllDevices = async () =>
    await Device.find()
        .sort({ status: 1 })
        .populate("unit")
        .populate("voucherIn")
        .populate("voucherOut")
        .populate("project")
        .populate("deviceTypeId");
        
exports.addNewDevice = async (request) => {
    return new Device({
        serialNumber: request.checkSerialNumber,
        deviceTypeId: request.checkDeviceTypeId,
        unit: request.checkUnitId,
        voucherIn: request.checkVoucherId,
        notes: request.checkNotes,
        project: request.projectId,
    });
};

exports.searchDeviceBySerialNumber = async (serialNumber) => {
    return await Device.find({ serialNumber: { $regex: serialNumber, $options: "i" } })
        .populate("deviceTypeId")
        .populate("unit")
        .populate("voucherIn")
        .populate("voucherOut")
        .populate("project");
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

exports.deleteDeviceById = async (checkDeviceId) => await Device.findByIdAndDelete(checkDeviceId);

exports.updateDeviceNote = async (request) => {
    const { checkDeviceId, checkNote } = request;

    return await Device.findByIdAndUpdate(checkDeviceId, {
        notes: checkNote,
    });
};

exports.checkVoucherOutInDevice = async (deviceId) => {
    const device = Device.findById(deviceId);
    if (device.voucherOut) return true;
    return false;
};
