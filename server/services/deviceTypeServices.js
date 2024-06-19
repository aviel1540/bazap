const DeviceType = require("../models/DeviceType");

exports.findAllDeviceTypes = async () => await DeviceType.find();

exports.addDeviceType = async (deviceType) => {
    return new DeviceType(deviceType);
};

exports.deleteDeviceType = async (deviceTypeId) => await DeviceType.findByIdAndDelete(deviceTypeId);
