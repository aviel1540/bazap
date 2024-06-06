const mongoose = require("mongoose");
const Device = require("./models/Device");
const DeviceType = require("./models/DeviceType");

async function dataFix() {
    const devices = await Device.find({ deviceTypeId: null });
    for (let device of devices) {
        // // Find the corresponding DeviceType
        const deviceType = await DeviceType.findOne({ deviceName: device.deviceType });
        console.log(deviceType.deviceName);
        if (deviceType) {
            device.deviceTypeId = deviceType._id;
            device.deviceType = undefined;
            console.debug(device.deviceType);
            await device.save();
            console.log(`Updated device with serialNumber: ${device.serialNumber}`);
        } else {
            console.error(`No DeviceType found for deviceType: ${device.deviceType} and catalogNumber: ${device.catalogNumber}`);
        }
    }
}

module.exports = {
    dataFix,
};
