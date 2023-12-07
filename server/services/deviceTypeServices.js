const DeviceType = require('../models/DeviceType');

exports.findAllDeviceTypes = async() => await DeviceType.find();

exports.addDeviceType = async(checkDeviceName) => {return new DeviceType({deviceName: checkDeviceName})}

exports.deleteDeviceType = async (deviceTypeId) => await DeviceType.findByIdAndDelete(deviceTypeId);
