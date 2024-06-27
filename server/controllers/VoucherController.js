const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");
const voucherService = require("../services/voucherServices");
const projectService = require("../services/projectServices");
const accessoryService = require("../services/accessoriesServices");
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
    const accessoriesData = req.body.accessoriesData;
    console.log(accessoriesData);
    let project;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);
        if (!project) return res.status(404).json({ message: "לא נמצא פרויקט" });

        const { newVoucher, autoNumber } = await createVoucher(detailes, true, checkProjectId);

        const updatedAutoNumber = await autoNumberService.findAutoNumberAndUpdate(autoNumber._id, number);
        await updatedAutoNumber.save();

        if (
            (!accessoriesData || !Array.isArray(accessoriesData) || accessoriesData.length === 0) &&
            (!devicesData || !Array.isArray(devicesData) || devicesData.length === 0)
        ) {
            return res.status(400).json({ message: "יש להזין מכשירים/צלמ" });
        }

        if (devicesData) {
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
        }
        if (accessoriesData) {
            for (const accessoryData of accessoriesData) {
                console.log(accessoryData);
                const deviceTypeId = escape(accessoryData.deviceTypeId);
                const quantity = escape(accessoryData.quantity);

                if (!quantity || !deviceTypeId) {
                    return res.status(400).json({ message: "נא למלא את כל השדות" });
                }
                const checkDeviceTypeId = validation.addSlashes(deviceTypeId);
                const checkQuantity = validation.addSlashes(quantity);
                const checkUnit = validation.addSlashes(unit);
                const newAccessory = await accessoryService.addNewAccessories({
                    checkDeviceTypeId,
                    checkUnitId: checkUnit,
                    checkQuantity,
                    checkVoucherId: newVoucher._id,
                    projectId,
                });

                await newAccessory.save();
                newVoucher.accessoriesList.push(newAccessory);
            }
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
        if (voucher.deviceList.length == 0 && voucher.accessoriesList.length == 0) {
            project.vouchersList = project.vouchersList.filter((item) => item._id != voucherId);
            project.save();
            await voucherService.deleteVoucher(voucherId);
        } else {
            return res.status(401).json({ message: 'אי אפשר למחוק שובר עם מסווגים/צל"מ' });
        }

        return res.status(200).json();
    } catch (err) {
        return res.status(500).json({ message: err.message });
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
    const accessoriesIds = req.body.accessoriesIds;
    let project;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);
        if (!project) return res.status(404).json({ message: "לא נמצא פרויקט" });
        const { newVoucher, autoNumber } = await createVoucher(detailes, false, checkProjectId);
        const updatedAutoNumber = await autoNumberService.findAutoNumberAndUpdate(autoNumber._id, number);
        await updatedAutoNumber.save();
        if (
            (!accessoriesIds || !Array.isArray(accessoriesIds) || accessoriesIds.length === 0) &&
            (!devicesIds || !Array.isArray(devicesIds) || devicesIds.length === 0)
        ) {
            return res.status(400).json({ message: "יש לבחור מכשירים/צלמ" });
        }
        const voucherId = newVoucher._id.toHexString();
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
            const deviceStatus = device.status;
            await deviceService.updateReturnDevice({
                deviceId,
                voucherId,
                deviceStatus,
            });
            newVoucher.deviceList.push(deviceId);
        });
        await Promise.all(devices);

        const accessories = accessoriesIds.map(async (accessoryId) => {
            const checkAccessoryId = validation.addSlashes(escape(accessoryId));
            const accessory = await accessoryService.findAccessoriesById(checkAccessoryId);
            if (!accessory) return res.status(400).json({ message: 'לא נמצא צל"מ' });
            if (accessory.status != DeviceStatus.FINISHED) {
                return res.status(401).json({ message: 'יש לדווח סטטוס הסתיים לצל"מ לפני ניפוק' });
            }
            if (!accessory.voucherIn) {
                return res.status(401).json({ message: 'אין לצל"מ שובר קבלה  - לא ניתן לנפק' });
            }
            await accessoryService.updateReturnAccessory({ id: accessoryId, voucherId, status: DeviceStatus.FINISHED_OUT });
            newVoucher.accessoriesList.push(accessoryId);
        });
        await Promise.all(accessories);

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
