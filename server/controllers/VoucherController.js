const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");
const voucherService = require("../services/voucherServices");
const projectService = require("../services/projectServices");

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

exports.addNewVoucher = async (req, res) => {
    const projectId = escape(req.params.projectId);
    const unitName = escape(req.body.unit);
    const type = escape(req.body.type); //boolean
    // console.log(type);
    const arrivedBy = escape(req.body.arrivedBy);
    const receivedBy = escape(req.body.receivedBy);
    let voucher;
    let project;
    try {
        if (![unitName, type, arrivedBy, receivedBy].every(Boolean)) {
            return res.status(400).json({ message: "נא למלא את כל השדות." });
        }
        const checkUnitName = validation.addSlashes(unitName);
        const checkArrivedBy = validation.addSlashes(arrivedBy);
        const checkreceivedBy = validation.addSlashes(receivedBy);

        const checkProjectId = validation.addSlashes(projectId);
        voucher = await voucherService.addVoucher({ checkUnitName, checkArrivedBy, checkreceivedBy, type, checkProjectId });
        await voucher.save();
        if (!voucher) return res.status(400).json({ message: "לא נוצר שובר נא לנסות שוב" });
        project = await projectService.findProjectById(checkProjectId);
        if (!project) return res.status(404).json({ message: "לא נמצא פרויקט" });
        console.log(voucher.voucherNumber);
        project.vouchersList.push(voucher);
        await project.save();
        return res.status(201).json({ message: "שובר נוצר ושויך בהצלחה !", id: voucher.id });
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
        // console.log('OUTPUT : ',voucher);
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
