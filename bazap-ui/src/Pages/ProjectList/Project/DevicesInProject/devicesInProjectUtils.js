export const areClassifiedAndNonClassifiedSelected = (devices, selectedRows) => {
    const selectedDevices = devices.filter((device) => selectedRows.includes(device._id));
    const classifiedDevices = selectedDevices.some((device) => device.deviceTypeId.isClassified);
    const nonClassifiedDevices = selectedDevices.some((device) => !device.deviceTypeId.isClassified);

    return classifiedDevices && nonClassifiedDevices;
};
