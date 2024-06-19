const mongoose = require("mongoose");
const Device = require("./models/Device");
const DeviceType = require("./models/DeviceType");

async function dataFix() {
    await fixDeviceType();
}
const fixDeviceType = async () => {
    const devices = await Device.find({ deviceTypeId: null });
    console.log(devices);
    for (let device of devices) {
        const deviceType = await DeviceType.findOne({ deviceName: device.deviceType });
        if (deviceType) {
            device.deviceTypeId = deviceType._id;
            device.deviceType = undefined;
            await device.save();
            console.log(`Updated device with serialNumber: ${device.serialNumber}`);
        } else {
            console.error(`No DeviceType found for deviceType: ${device.deviceType} and catalogNumber: ${device.catalogNumber}`);
        }
    }
};
module.exports = {
    dataFix,
};
