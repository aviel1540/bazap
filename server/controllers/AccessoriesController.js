const escape = require("escape-html");
const validation = require("../utils/validation");
const accessoriesService = require("../services/accessoriesService");
const voucherService = require("../services/voucherServices");
const { DeviceStatus } = require("../constants/DeviceStatus");

exports.getAllAccessories = async (req, res) => {
    let accessories;
    try {
        accessories = await accessoriesService.findAllAccessories();
        if (!accessories) {
            return res.status(404).json({ message: "לא קיימים פרוייקטים" });
        }
        return res.status(200).json(accessories);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


exports.getAccessory = async (req, res) => {
    const accessoryId = escape(req.params.id);
    let accessoryFound;
    try {
        const checkAccessoryId = validation.addSlashes(accessoryId);
        accessoryFound = await accessoriesService.findAccessoriesById(checkAccessoryId);
        if (!accessoryFound) {
            return res.status(400).json({ message: "לא נמצא מכשיר" });
        }
        return res.status(200).json(accessoryFound);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
}

exports.changeStatus = async (req, res) => {
    const accessoryId = escape(req.params.id);
    const status = escape(req.body.status);
    try {
        const accessory = await accessoriesService.findAccessoriesById(accessoryId)
        if (!accessory) return res.status(404).json({ message: "לא נמצא צלמ" })
        const checkAccessoryId = validation.addSlashes(accessoryId);
        const checkStatus = validation.addSlashes(status);
        switch (checkStatus) {
            case DeviceStatus.WAIT_TO_WORK:
            case DeviceStatus.AT_WORK:
                await accessoriesService.changeStatus({ checkAccessoryId, checkStatus })
                break;
            case DeviceStatus.FINISHED:
                if (accessory.quantity == accessory.fix + accessory.defective) {
                    await accessoriesService.changeStatus({ checkAccessoryId, checkStatus })
                } else {
                    return res.status(400).json({ message: "לא ניתן לשנות סטטוס אם כל המכשירים לא טופלו" });
                }
                break;
            case DeviceStatus.FINISHED_OUT:
                if (accessory.status == DeviceStatus.FINISHED) {
                    await accessoriesService.changeStatus({ checkAccessoryId, checkStatus })
                } else {
                    return res.status(400).json({ message: "לא ניתן לשנות סטטוס כל עוד כל המכשירים לא דווחו" });
                }
                break;
            default:
                return res.status(400).json({message: "סטטוס לא קיים"})
        }
        return res.status(201).json({message: "הסטטוס השתנה בהצלחה !"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}