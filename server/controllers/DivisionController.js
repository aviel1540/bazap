const escape = require("escape-html");
const validation = require("../utils/validation");
const divisionServices = require("../services/divisionServices");
const brigadeServices = require("../services/brigadeServices");
const unitServices = require("../services/unitsServices");

exports.getAllDivisions = async (req, res) => {
    let divisions;
    try {
        divisions = await divisionServices.findAllDivisions();
        if (!divisions) return res.status(404).json({ message: "לא קיימות אוגדות" });
        return res.status(200).json(divisions);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getDivision = async (req, res) => {
    const divisionId = escape(req.params.id);
    let division;
    try {
        if (!divisionId) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkDivisionId = validation.addSlashes(divisionId);
        division = await divisionServices.findDivisionById(checkDivisionId);
        if (!division) return res.status(404).json({ message: "לא קיימת אוגדה" });
        return res.status(200).json(division);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.addNewDivision = async (req, res) => {
    const divisionName = escape(req.body.divisionName);
    let newDivision;
    try {
        if (!divisionName) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkDivisionName = validation.addSlashes(divisionName);
        const DivisionName = "אוגדה " + checkDivisionName;
        const checkDivisionExists = await divisionServices.findDivisionByName(DivisionName);
        if (checkDivisionExists) return res.status(401).json({ message: "שם האוגדה קיים במערכת" });
        newDivision = await divisionServices.addDivision(DivisionName);
        const brigadeUnitName = 'מפאו"ג ' + checkDivisionName;
        newBrigade = await brigadeServices.addBrigade({ brigadeName: brigadeUnitName, division: newDivision._id });
        newUnit = await unitServices.addUnit({ unitsName: brigadeUnitName, brigade: newBrigade._id });
        newBrigade.unitsList.push(newUnit);
        newDivision.brigadesList.push(newBrigade);
        await newDivision.save();
        await newBrigade.save();
        await newUnit.save();
        return res.status(200).json(newDivision);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.updateDivisionName = async (req, res) => {
    const divisionId = escape(req.params.id);
    const divisionName = escape(req.body.divisionName);
    let division;
    try {
        if (!divisionId || !divisionName) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkDivisionId = validation.addSlashes(divisionId);
        const checkDivisionName = validation.addSlashes(divisionName);
        division = await divisionServices.updateDivisionName({ checkDivisionId, checkDivisionName });
        return res.status(200).json(division);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.deleteDivision = async (req, res) => {
    const divisionId = escape(req.params.id);
    let division;
    try {
        if (!divisionId) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkDivisionId = validation.addSlashes(divisionId);
        division = await divisionServices.findDivisionById(checkDivisionId);
        if (!division) return res.status(404).json({ message: "לא נמצאה יחידה" });
        if (division.brigadesList.length > 0) return res.status(400).json({ message: "קיימות יחידות תחת האוגדה" });
        await divisionServices.deleteDivision(checkDivisionId);
        return res.status(200).json({ message: "האוגדה נמחקה בהצלחה" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
