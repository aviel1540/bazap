const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");
const voucherService = require("../services/voucherServices");
const projectService = require("../services/projectServices");
const autoNumberService = require("../services/autoNumberServices");
const { DeviceStatus } = require("../constants/DeviceStatus");

exports.getVoucherById = async (req, res) => {
    const voucherId = escape(req.params.id);
    let voucher;
    try {
        const checkVoucherId = validation.addSlashes(voucherId);

        voucher = await voucherService.findVoucherById(checkVoucherId);
        return res.status(200).json(voucher);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.addNewVoucherIn = async (req, res) => {
    const projectId = escape(req.params.projectId);
    const unit = escape(req.body.unit);
    const detailes = {
        unit: unit,
        arrivedBy: escape(req.body.arrivedBy),
        receivedBy: escape(req.body.receivedBy),
    };
    const devicesData = req.body.devicesData;
    let project;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);
        if (!project) return res.status(404).json({ message: "לא נמצא פרויקט" });

        const { newVoucher, autoNumber } = await createVoucher(detailes, true, checkProjectId);

        const updatedAutoNumber = await autoNumberService.findAutoNumberAndUpdate(autoNumber._id, number);
        await updatedAutoNumber.save();

        if (!devicesData || !Array.isArray(devicesData) || devicesData.length === 0) {
            return res.status(400).json({ message: "לא נמצאו מכשירים" });
        }

        for (const deviceData of devicesData) {
            const serialNumber = escape(deviceData.serialNumber);
            const deviceTypeId = escape(deviceData.deviceTypeId);

            if (!serialNumber || !deviceTypeId) {
                return res.status(400).json({ message: "נא למלא את כל השדות" });
            }
            const checkSerialNumber = validation.addSlashes(serialNumber);
            const checkDeviceTypeId = validation.addSlashes(deviceTypeId);
            const checkUnit = validation.addSlashes(unit);
            const newDevice = await deviceService.addNewDevice({
                checkSerialNumber,
                checkDeviceTypeId,
                checkUnitId: checkUnit,
                checkVoucherId: newVoucher._id,
                projectId,
            });

            await newDevice.save();
            newVoucher.deviceList.push(newDevice);
        }
        await newVoucher.save();
        project.vouchersList.push(newVoucher);
        await project.save(newVoucher);
        return res.status(201).json({ message: "שובר נוצר ושויך בהצלחה !", id: newVoucher.id });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAllVouchersInProject = async (req, res) => {
    const projectId = escape(req.params.projectId);
    try {
        const checkProjectId = validation.addSlashes(projectId);
        const project = await projectService.findProjectById(checkProjectId);
        if (!project) {
            return res.status(404).json({ message: "לא נמצא פרויקט" });
        }
        const vouchersList = project.vouchersList;
        return res.status(200).json(vouchersList);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.deleteVoucher = async (req, res) => {
    try {
        const voucherId = escape(req.params.id);
        const voucher = await voucherService.findVoucherById(voucherId);
        const project = voucher.project;
        if (voucher.deviceList.length == 0) {
            project.vouchersList = project.vouchersList.filter((item) => item._id != voucherId);
            project.save();
            await voucherService.deleteVoucher(voucherId);
        } else {
            return res.status(401).json({ message: "אי אפשר למחוק שובר עם מכשירים" });
        }

        return res.status(200).json();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

exports.addNewVoucherOut = async (req, res) => {
    const projectId = escape(req.params.projectId);

    const detailes = {
        unit: escape(req.body.unit),
        arrivedBy: escape(req.body.arrivedBy),
        receivedBy: escape(req.body.receivedBy),
    };
    const devicesIds = req.body.devicesIds;
    let project;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);
        if (!project) return res.status(404).json({ message: "לא נמצא פרויקט" });
        const { newVoucher, autoNumber } = await createVoucher(detailes, false, checkProjectId);
        const updatedAutoNumber = await autoNumberService.findAutoNumberAndUpdate(autoNumber._id, number);
        await updatedAutoNumber.save();
        if (!devicesIds || !Array.isArray(devicesIds) || devicesIds.length === 0) {
            return res.status(400).json({ message: "לא נמצאו מכשירים" });
        }
        const devices = devicesIds.map(async (deviceId) => {
            const checkDeviceId = validation.addSlashes(escape(deviceId));
            const device = await deviceService.findDeviceById(checkDeviceId);
            const deviceSN = device.serialNumber;
            if (!device) return res.status(400).json({ message: deviceSN + " צ' לא קיים !" });
            if (device.status != DeviceStatus.FIXED && device.status != DeviceStatus.DEFECTIVE) {
                return res.status(401).json({ message: deviceSN + " יש לדווח סטטוס תקין / תקול" });
            }
            if (!device.voucherIn) {
                return res.status(401).json({ message: "אין למכשיר שובר כניסה  - לא ניתן לנפק" });
            }
            const voucherId = newVoucher._id.toHexString();

            const deviceStatus = device.status;
            await deviceService.updateReturnDevice({
                deviceId,
                voucherId,
                deviceStatus,
            });
            newVoucher.deviceList.push(deviceId);
        });
        await Promise.all(devices);
        await newVoucher.save();
        project.vouchersList.push(newVoucher);
        await project.save(newVoucher);
        return res.status(201).json({ message: "שובר יציאה נוצר בהצלחה", newVoucher });
    } catch (err) {
        return res.status(400).json(err.message);
    }
};

const createVoucher = async (detailes, type, checkProjectId) => {
    const { unit, arrivedBy, receivedBy } = detailes;
    if (![unit, arrivedBy, receivedBy].every(Boolean)) {
        throw new Error("יש למלא את כל השדות");
    }
    const checkUnitName = validation.addSlashes(unit);
    const checkArrivedBy = validation.addSlashes(arrivedBy);
    const checkreceivedBy = validation.addSlashes(receivedBy);

    project = await projectService.findProjectById(checkProjectId);
    let autoNumber = await autoNumberService.findAutoNumber();
    if (!autoNumber) {
        autoNumber = await autoNumberService.createAutoNumber();
        await autoNumber.save();
    }

    number = autoNumber.voucherNumber;
    const voucherNumber = validation.leftPadWithZero(number + 1);

    const newVoucher = await voucherService.addVoucher({
        voucherNumber,
        checkUnitName,
        checkArrivedBy,
        checkreceivedBy,
        type,
        checkProjectId,
    });
    if (!newVoucher) {
        throw new Error("שגיאה ביצירת שובר");
    }
    await newVoucher.save();
    return { newVoucher, autoNumber };
};
