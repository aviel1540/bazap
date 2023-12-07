const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");
const voucherService = require("../services/voucherServices");


exports.addNewVoucher = async (req, res) => {
    const projectId = escape(req.params.projectId);
    const unitName = escape(req.body.units);
    const type = escape(req.body.type); //boolean
    const arrivedBy = escape(req.body.arrivedBy);
    const recievedBy = escape(req.body.recievedBy);
    let voucher;
    try {
        if (![unitName, type, arrivedBy, recievedBy].every(Boolean)) {
            return res.status(400).json({ message: "נא למלא את כל השדות." });
        }
        const checkUnitName = validation.addSlashes(unitName);
        const checkArrivedBy = validation.addSlashes(arrivedBy);
        const checkRecievedBy = validation.addSlashes(recievedBy);

        voucher = await voucherService.addVoucher({ checkUnitName, checkArrivedBy, checkRecievedBy, type })

        await voucher.save();
        if(!voucher) return res.status(400).json({message: "לא נוצר שובר ת נא לנסות שוב"});
        return res.status(201).json({message: "שובר נוצר בהצלחה !"});
    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
};
