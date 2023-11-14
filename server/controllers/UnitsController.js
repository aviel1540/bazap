const escape = require("escape-html");
const validation = require("../utils/validation");
const unitsServices = require("../services/unitsServices");

exports.getAllUnits = async (req, res) => {
    let units;
    try {
        units = await unitsServices.findAllUnits();
        if (!units) return res.status(404).json({ message: "לא קיימות יחידות" });
        return res.status(200).json(units);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.addNewUnit = async (req, res) => {
    const unitName = escape(req.body.unitName);
    let newUnit;
    try {
        if (!unitName) return res.status(400).json({ message: "יש למלא את כל השדות" })
        const checkUnitName = validation.addSlashes(unitName);
        newUnit = await unitsServices.addUnit(checkUnitName);
        await newUnit.save();
        return res.status(200).json(newUnit);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
}

exports.getUnitByName = async (req, res) => {
    const unitName = escape(req.params.unitName);
    let unit;
    try {
        if(!unitName) return res.status(400).json({ message:"יש למלא את השדות"});
        const checkUnitName = validation.addSlashes(unitName);
        unit = await unitsServices.findUnitByName(checkUnitName);
        if(!unit) return res.status(404).json({message: "יחידה לא קיימת"});
        return res.status(200).json(unit);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
}

