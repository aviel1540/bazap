const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");
const voucherService = require("../services/voucherServices");
const { DeviceStatus } = require("../constants/DeviceStatus");

exports.addNewDevices = async (req, res) => {
    try {
        const devicesData = req.body;

        if (!devicesData || !Array.isArray(devicesData) || devicesData.length === 0) {
            return res.status(400).json({ message: "לא נמצא מכשיר" });
        }
        const insertedDevices = [];
        const voucherId = escape(devicesData[0].voucherId);
        const checkVoucherId = validation.addSlashes(voucherId);
        const voucher = await voucherService.findVoucherById(checkVoucherId);

        for (const deviceData of devicesData) {
            const serialNumber = escape(deviceData.serialNumber);
            const type = escape(deviceData.type);
            const voucherId = escape(deviceData.voucherId);
            const unitId = escape(deviceData.unitId);

            if (!serialNumber || !type || !voucherId || !unitId) {
                return res.status(400).json({ message: "נא למלא את כל השדות" });
            }
            const checkSerialNumber = validation.addSlashes(serialNumber);
            const checkType = validation.addSlashes(type);
            const checkUnitId = validation.addSlashes(unitId);
            const newDevice = await deviceService.addNewDevice({
                checkSerialNumber,
                checkType,
                checkUnitId,
                checkVoucherId,
                projectId: voucher.project._id,
            });

            await newDevice.save();
            voucher.deviceList.push(newDevice);
            insertedDevices.push(newDevice);
        }
        voucher.save();

        return res.status(200).json(insertedDevices);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
exports.getDeviceById = async (req, res) => {
    const categoryId = escape(req.params.id);
    let deviceFound;
    try {
        const checkcategoryId = validation.addSlashes(categoryId);
        deviceFound = await deviceService.findDeviceById(checkcategoryId);
        if (!deviceFound) {
            return res.status(400).json({ message: "לא נמצא מכשיר" });
        }
        return res.status(200).json(deviceFound);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};

exports.getDeviceBySerialNumber = async (req, res) => {
    const categorySerialNumber = escape(req.params.serialnumber);
    let deviceFound;
    try {
        const checkSerialNumber = validation.addSlashes(categorySerialNumber);
        deviceFound = await deviceService.findDeviceBySerialNumber(checkSerialNumber);
        if (!deviceFound) {
            return res.status(200).json({ message: "צ' לא קיים" });
        }
        return res.status(200).json(deviceFound);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};

exports.returnDevice = async (req, res) => {
    const voucherId = escape(req.params.id);
    const devicesData = req.body;
    let errors = "";
    try {

        checkVoucherId = validation.addSlashes(voucherId);

        const voucherOut = await voucherService.findVoucherById(checkVoucherId);
        if (!voucherOut) return res.status(401).json({ message: "יש לדווח סטטוס תקין / תקול" });


        const devices = devicesData.map(async (deviceSN) => {
            const checkDevice = validation.addSlashes(escape(deviceSN));

            const device = await deviceService.findDeviceBySerialNumber(checkDevice);
            if (!device) throw new Error("מכשיר לא קיים");
            if (device.status != DeviceStatus.FIXED && device.status != DeviceStatus.DEFECTIVE) {
                return res.status(401).json({ message: "יש לדווח סטטוס תקין / תקול" });
            }
            if (!device.voucherIn) {
                return res.status(401).json({ message: "אין למכשיר שובר כניסה  - לא ניתן לנפק" });
            }
            const deviceId = device._id;
            const deviceStatus = device.status;
            await deviceService.updateReturnDevice({
                deviceId,
                checkVoucherId,
                deviceStatus
            });
            
            voucherOut.deviceList.push(deviceId);
        });
        await Promise.all(devices);
        await voucherOut.save();

        return res.status(201).json({ message: "שובר נוצר בהצלחה", voucherOut });
    } catch (error) {
        errors += error.message + `\n`;
    }
    if (errors.length == 0) {
        return res.status(201).json({ message: "המכשיר עודכן בהצלחה." });
    } else {
        return res.status(400).json({ message: errors });
    }
};

exports.changeStatus = async (req, res) => {
    const deviceId = escape(req.params.id);
    const status = escape(req.body.status);
    const device = await deviceService.findDeviceById(deviceId);
    if (!device) {
        return res.status(404).json({ message: "לא נמצא מכשיר" });
    }
    try {
        const checkDeviceId = validation.addSlashes(deviceId);
        const checkStatus = validation.addSlashes(status);
        switch (checkStatus) {
            case DeviceStatus.WAIT_TO_WORK:
            case DeviceStatus.AT_WORK:
                await deviceService.updateStatus({ checkDeviceId, checkStatus });
                break;
            case DeviceStatus.FIXED:
            case DeviceStatus.DEFECTIVE:
                if (device.status == DeviceStatus.AT_WORK) {
                    await deviceService.updateStatus({ checkDeviceId, checkStatus });
                } else {
                    return res.status(400).json({ message: "סטטוס מכשיר צריך להיות בעבודה כדי לדווח תקין או מושבת" });
                }
                break;
            case DeviceStatus.FIXED_RETURN:
            case DeviceStatus.DEFECTIVE_RETURN:
                if ([DeviceStatus.FIXED, DeviceStatus.DEFECTIVE].includes(device.status)) {
                    await deviceService.updateStatus({ checkDeviceId, checkStatus });
                } else {
                    return res.status(400).json({ message: "סטטוס מכשיר צריך להיות תקין או מושבת כדי לדווח שחזר ליחידה" });
                }
                break;
            default:
                return res.status(400).json({ message: "סטטוס לא קיים" });
        }
        return res.status(201).json({ message: "המכשיר עודכן בהצלחה." });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

exports.updateDetails = async (req, res) => {
    const deviceId = escape(req.params.id);
    const serialNumber = escape(req.body.serialNumber);
    const type = escape(req.body.type);
    let deviceFound;
    try {
        const checkDeviceId = validation.addSlashes(deviceId);
        const checkSerialNumber = validation.addSlashes(serialNumber);
        const checkType = validation.addSlashes(type);
    } catch (err) { }
};

exports.getAllDevices = async (req, res) => {
    let devices;
    try {
        devices = await deviceService.findAllDevices();
        if (!devices) {
            return res.status(404).json({ message: "לא קיימים מכשירים" });
        }
        return res.status(200).json(devices);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAllDevicesInProject = async (req, res) => {
    try {
        const projectId = escape(req.params.id);
        const devices = await deviceService.findAllDevicesByProject(projectId);

        return res.status(200).json(devices);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAllDevicesInLab = async(req,res) => {
    try {
        const projectId = escape(req.params.id);
        const devices = await deviceService.findAllDevicesInLab(projectId);
        console.log(devices)

        return res.status(200).json(devices);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
