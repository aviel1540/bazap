const escape = require("escape-html");
const validation = require("../utils/validation");
const deviceService = require("../services/deviceServices");

var voucherCnt = 0;

exports.addNewVoucher = async(req,res) => {
    const projectId = escape(req.params.projectId);
    const unitName = escape(req.body.units);
    const type = escape(req.body.type); //boolean
    const arrivedBy = escape(req.body.arrivedBy); 
    const recievedBy = escape(req.body.recievedBy);

    try {
        if (
			![
				unitName,
				type,
				arrivedBy,
				recievedBy
			].every(Boolean)
		) {
			return res.status(400).json({ message: "נא למלא את כל השדות." });
		}

        
    } catch(err) {

    }
}