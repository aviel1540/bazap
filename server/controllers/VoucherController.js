const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");
const voucherService = require("../services/voucherServices");
const projectService = require("../services/projectServices");
const autoNumberService = require("../services/autoNumberServices");


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
    const type = escape(req.body.type); //boolean - true
    const arrivedBy = escape(req.body.arrivedBy);
    const recievedBy = escape(req.body.recievedBy);
    const devicesData = req.body.devicesData;
    let newVoucher;
    let project;
    try {
        if (![unit, type, arrivedBy, recievedBy].every(Boolean)) {
            return res.status(400).json({ message: "נא למלא את כל השדות." });
        }
        if(type === false) return res.status(400).json({ message:"לא ניתן ליצור שובר ניפוק דרך חלון זה"})
        const checkUnitName = validation.addSlashes(unit);
        const checkArrivedBy = validation.addSlashes(arrivedBy);
        const checkreceivedBy = validation.addSlashes(recievedBy);
        const checkProjectId = validation.addSlashes(projectId);

        project = await projectService.findProjectById(checkProjectId);
        if (!project) return res.status(404).json({ message: "לא נמצא פרויקט" });
        const autoNumber = await autoNumberService.findAutoNumber();

        if (autoNumber.length == 0) {
            autoNumber = await autoNumberService.createAutoNumber();
        }
        number = autoNumber[0].voucherNumber;

        const voucherNumber = validation.leftPadWithZero(number + 1);

        newVoucher = await voucherService.addVoucherIn({ voucherNumber, checkUnitName, checkArrivedBy, checkreceivedBy, type, checkProjectId })
        if (!newVoucher) {
            return res.status(400).json({ message: "לא נוצר שובר נא לנסות שוב" });
        }
        const updatedAutoNumber = await autoNumberService.findAutoNumberAndUpdate(autoNumber[0]._id, number);
        await updatedAutoNumber.save()

        if (!devicesData || !Array.isArray(devicesData) || devicesData.length === 0) {
            return res.status(400).json({ message: "לא נמצאו מכשירים" });
        }

        for (const deviceData of devicesData) {
            const serialNumber = escape(deviceData.serialNumber);
            const type = escape(deviceData.type);

            if (!serialNumber || !type) {
                return res.status(400).json({ message: "נא למלא את כל השדות" });
            }
            const checkSerialNumber = validation.addSlashes(serialNumber);
            const checkType = validation.addSlashes(type);
            const newDevice = await deviceService.addNewDevice({
                checkSerialNumber,
                checkType,
                checkVoucherId: newVoucher._id,
                projectId,
            });

            await newDevice.save();
            newVoucher.deviceList.push(newDevice);
        }
        await newVoucher.save();
        project.vouchersList.push(newVoucher);
        await project.save(newVoucher);
        console.log(newVoucher)
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

exports.addNewVoucherOut = async(req,res) => {
    const projectId = escape(req.params.projectId);
    const unit = escape(req.body.unit);
    const type = escape(req.body.type); //boolean - false
    const arrivedBy = escape(req.body.arrivedBy);
    const recievedBy = escape(req.body.recievedBy);
    const devicesIds = req.body.devicesIds;
    let newVoucher;
    let project;
    try { 
        if (![unit, type, arrivedBy, recievedBy].every(Boolean)) {
            return res.status(400).json({ message: "נא למלא את כל השדות." });
        }
        if(type === true) return res.status(400).json({ message:"לא ניתן ליצור שובר קבלה דרך חלון זה"})
        console.log(type)
        const checkUnitName = validation.addSlashes(unit);
        const checkArrivedBy = validation.addSlashes(arrivedBy);
        const checkreceivedBy = validation.addSlashes(recievedBy);
        const checkProjectId = validation.addSlashes(projectId);
    } catch(err)  {

    }
}


