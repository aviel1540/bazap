export const aggregadeDevices = (devices) => {
    const aggereation = {
        units: {},
        deviceTypes: {},
    };

    devices.forEach((device) => {
        if (device.deviceTypeId.isClassified) {
            aggereation.units[device.deviceTypeId.deviceName] = (aggereation.units[device.deviceTypeId.deviceName] || 0) + 1;
        } else {
            aggereation.units[device.deviceTypeId.deviceName] =
                (aggereation.units[device.deviceTypeId.deviceName] || 0) + device.deviceTypeId.quantity;
        }

        aggereation.deviceTypes[device.unit.unitsName] = (aggereation.deviceTypes[device.unit.unitsName] || 0) + 1;
    });
    return aggereation;
};
