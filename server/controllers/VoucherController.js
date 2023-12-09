const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");
const voucherService = require("../services/voucherServices");
const projectService = require("../services/projectServices");


exports.addNewVoucher = async (req, res) => {
    const projectId = escape(req.params.projectId);
    const unitName = escape(req.body.units);
    const type = escape(req.body.type); //boolean
    const arrivedBy = escape(req.body.arrivedBy);
    const recievedBy = escape(req.body.recievedBy);
    let voucher;
    let project;
    try {
        if (![unitName, type, arrivedBy, recievedBy].every(Boolean)) {
            return res.status(400).json({ message: "נא למלא את כל השדות." });
        }
        const checkUnitName = validation.addSlashes(unitName);
        const checkArrivedBy = validation.addSlashes(arrivedBy);
        const checkRecievedBy = validation.addSlashes(recievedBy);

        voucher = await voucherService.addVoucher({ checkUnitName, checkArrivedBy, checkRecievedBy, type })
        await voucher.save();
        if (!voucher) return res.status(400).json({ message: "לא נוצר שובר נא לנסות שוב" });
        const checkProjectId = validation.addSlashes(projectId);
        project = await projectService.findProjectById(checkProjectId);
        if (!project) return res.status(404).json({ message: "לא נמצא פרויקט" })

        project.vouchersList.push(voucher);
        return res.status(201).json({ message: "שובר נוצר ושויך בהצלחה !" });
    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
};

exports.getAllVouchersInProject = async (req, res) => {
    const projectId = escape(req.params.projectId);

    let voucherList;
    try {
        const checkProjectId = validation.addSlashes(projectId);
        voucherList = await projectService.showVoucherList(checkProjectId);
        console.log(voucherList);
        if (!voucherList) return res.status(404).json({ message: "לא נמצא פרויקט" })

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
