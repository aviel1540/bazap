export const aggregateDevices = (devices) => {
    const projects = [];
    const vouchers = [];
    const aggregation = {
        units: {}, // Store units with classified vs non-classified counts
        deviceTypes: {}, // Store device types counts across all units
        deviceStatus: {},
        status: {},
        projects: {
            finished: 0,
            nonFinished: 0,
        },
        vouchers: {
            vouchersIn: 0,
            vouchersOut: 0,
        },
    };

    devices.forEach((device) => {
        const deviceName = device.deviceTypeId.deviceName;
        const unitName = device.unit.unitsName;
        const isClassified = device.deviceTypeId.isClassified;
        const quantity = isClassified ? 1 : device.quantity || 1;
        const deviceStatus = device.status;
        if (!aggregation.units[unitName]) {
            aggregation.units[unitName] = {
                classified: 0,
                nonClassified: 0,
                deviceTypes: {},
            };
        }
        if (!projects.includes(device.project._id)) {
            aggregation.projects.finished += device.project.finished ? 1 : 0;
            aggregation.projects.nonFinished += device.project.finished ? 0 : 1;
            projects.push(device.project._id);
        }
        if (!vouchers.includes(device.voucherIn._id)) {
            vouchers.push(device.voucherIn._id);
            aggregation.vouchers.vouchersIn++;
        }
        if (device.voucherOut != null && !vouchers.includes(device.voucherOut._id)) {
            vouchers.push(device.voucherOut._id);
            aggregation.vouchers.vouchersOut++;
        }

        if (isClassified) {
            aggregation.units[unitName].classified += 1;
        } else {
            aggregation.units[unitName].nonClassified += quantity;
        }

        if (!aggregation.units[unitName].deviceTypes[deviceName]) {
            aggregation.units[unitName].deviceTypes[deviceName] = 0;
        }
        if (!aggregation.status[deviceStatus]) {
            aggregation.status[deviceStatus] = 0;
        }
        aggregation.status[deviceStatus]++;
        aggregation.units[unitName].deviceTypes[deviceName] += quantity;
        aggregation.deviceTypes[deviceName] = (aggregation.deviceTypes[deviceName] || 0) + quantity;
    });

    return aggregation;
};
