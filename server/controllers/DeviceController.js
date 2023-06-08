const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");
const { DeviceStatus } = require("../constants/DeviceStatus");
exports.addNewDevice = async (req, res) => {
    const serialNumber = escape(req.body.serialNumber);
    const category = escape(req.body.category);
    const type = escape(req.body.type);
    let newDevice;
    try {
        if (
            !serialNumber ||
            !category ||
            !type
        ) {
            return res.status(400).json({ message: "נא למלא את כל השדות." });
        }

        const checkSerialNumber = validation.addSlashes(serialNumber);
        const checkCategory = validation.addSlashes(category);
        const checkType = validation.addSlashes(type);

        newDevice = await deviceService.addNewDevice({
            checkSerialNumber,
            checkCategory,
            checkType
        })
        await newDevice.save();
        return res.status(200).json(newDevice);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

}

exports.getDeviceById = async (req, res) => {
    const categoryId = escape(req.params.id);
    let deviceFound;
    try {
        const checkcategoryId = validation.addSlashes(categoryId);
        deviceFound = await deviceService.findDeviceById(checkcategoryId);
        if (!deviceFound) {
            return res.status(400).json({ message: "לא נמצא מכשיר" })
        }
        return res.status(200).json(deviceFound);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
}

exports.getDeviceBySerialNumber = async (req, res) => {
    const categorySerialNumber = escape(req.params.serialnumber);
    let deviceFound;
    try {
        const checkSerialNumber = validation.addSlashes(categorySerialNumber);
        deviceFound = await deviceService.findDeviceBySerialNumber(checkSerialNumber);
        if (!deviceFound) {
            return res.status(400).json({ message: "צ' לא קיים" });
        }
        return res.status(200).json(deviceFoundv);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
}

exports.statusChangeToFinish = async (req, res) => {
    const deviceId = escape(req.params.id);
    const status = escape(req.body.status);
    const fixedBy = escape(req.body.fixedBy);
    const notes = escape(req.body.notes);
    let updateDevice;
    try {
        const checkDeviceId = validation.addSlashes(deviceId);
        const checkStatus = validation.addSlashes(status);
        const checkFixedBy = validation.addSlashes(fixedBy);
        const checkNotes = validation.addSlashes(notes);


        if (!checkFixedBy) {
            return res.status(401).json({ message: "יש למלא שם טכנאי" });
        }

        if (checkStatus == DeviceStatus.WAIT_TO_WORK ||
            checkStatus == DeviceStatus.AT_WORK ||
            checkStatus == DeviceStatus.RETURNED) {
            return res.status(401).json({ message: "יש לדווח סטטוס תקין / תקול" });
        }

        updateDevice = await deviceService.updateDeviceDatailsInFinish({
            checkDeviceId,
            checkStatus,
            checkFixedBy,
            checkNotes
        })
        if (!updateDevice)
            return res
                .status(401)
                .json({ message: "הדיווח נכשל - יש לנסות שוב" });
        await updatecategory.save();

        return res.status(201).json({ message: "המכשיר עודכן בהצלחה." });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

exports.changeStatus = async (req, res) => {
    const deviceId = escape(req.params.id);
    const place = escape(req.body.place);
    let deviceFound;
    try {
        const checkDeviceId = validation.addSlashes(deviceId);
        const checkPlace = validation.addSlashes(place);

        categoryFound = await deviceService.findcategoryById(checkDeviceId);
        switch (checkPlace) {
            case DeviceStatus.AT_WORK:
                deviceFound = await deviceService.updateStatusStart({ checkDeviceId, checkPlace });
                break;
            case DeviceStatus.FINISHED:
                deviceFound = await deviceService.updateStatusEnd({ checkDeviceId, checkPlace });
                break;
            case DeviceStatus.RETURNED:
                if (deviceFound.place != DeviceStatus.FINISHED) {
                    return res.status(401).json({ message: "יש לדווח מכשיר מוכן לפני החזרה" });
                }
                categoryFound = await deviceService.updateStatusReturn({ checkDeviceId, checkPlace });
                break;
            default:
                return res.status(404).json({ message: "ערך לא תקין" });
        }
        // await categoryFound.save();
        return res.status(201).json({ message: "המכשיר עודכן בהצלחה." });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

exports.updateDetails = async (req, res) => {
    const deviceId = escape(req.params.id);
    const serialNumber = escape(req.body.serialNumber);
    const type = escape(req.body.type);
    let deviceFound;
    try {
        const checkDeviceId = validation.addSlashes(deviceId);
        const checkSerialNumber = validation.addSlashes(serialNumber);
        const checkType = validation.addSlashes(type);



    } catch (err) {

    }

}

exports.getAllDevices = async (req, res) => {

}