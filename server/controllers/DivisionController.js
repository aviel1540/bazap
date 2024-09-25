const escape = require("escape-html");
const validation = require("../utils/validation");
const divisionServices = require("../services/divisionServices")


exports.getAllDivisions = async (req, res) => {
    let divisions;
    try {
        divisions = await divisionServices.findAllDivisions();
        if(!divisions) return res.status(404).json({ message: "לא קיימות אוגדות" });
        return res.status(200).json(divisions);
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.getDivision = async(req,res) => {
    const divisionId = escape(req.params.id);
    let division;
    try {
        if(!divisionId) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkDivisionId = validation.addSlashes(divisionId);
        division = await divisionServices.findDivisionById(checkDivisionId);
        if(!division) return res.status(404).json({ message: "לא קיימת אוגדה עם תעודת זהות זו" });
        return res.status(200).json(division);
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.addNewDivision = async(req,res) => {
    const divisionName = escape(req.body.divisionName);
    let newDivision;
    try {
        if(!divisionName) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkDivisionName = validation.addSlashes(divisionName);
        newDivision = await divisionServices.addDivision(checkDivisionName);
        await newDivision.save();
        return res.status(200).json(newDivision);
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.updateDivisionName = async(req,res) => {
    const divisionId = escape(req.params.id);
    const divisionName = escape(req.body.divisionName);
    let division;
    try {
        if(!divisionId || !divisionName) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkDivisionId = validation.addSlashes(divisionId);
        const checkDivisionName = validation.addSlashes(divisionName);
        division = await divisionServices.updateDivisionName({ checkDivisionId, checkDivisionName });
        return res.status(200).json(division);
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
}
