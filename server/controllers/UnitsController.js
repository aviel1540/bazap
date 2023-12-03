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
};

exports.addNewUnit = async (req, res) => {
    const unitName = escape(req.body.unitName);
    let newUnit;
    try {
        if (!unitName) return res.status(400).json({ message: "יש למלא את כל השדות" });
        const checkUnitName = validation.addSlashes(unitName);
        newUnit = await unitsServices.addUnit(checkUnitName);
        await newUnit.save();
        return res.status(200).json(newUnit);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

exports.getUnitByName = async (req, res) => {
    const unitName = escape(req.params.unitName);
    let unit;
    try {
        if (!unitName) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkUnitName = validation.addSlashes(unitName);
        unit = await unitsServices.findUnitByName(checkUnitName);
        if (!unit) return res.status(404).json({ message: "יחידה לא קיימת" });
        return res.status(200).json(unit);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

exports.getUnitById = async (req, res) => {
    const unitId = escape(req.params.id);
    let unit;
    try {
        const checkUnitId = validation.addSlashes(unitId);
        unit = await unitsServices.findUnitById(checkUnitId);
        return res.status(200).json(unit);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.updateUnitDetailes = async (req, res) => {
    console.log(req);
    const unitId = escape(req.params.id);
    const unitNewName = escape(req.body.unitsName);
    let updatedUnit;
    try {
        if (!unitNewName) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkUnitId = validation.addSlashes(unitId);
        const checkNewName = validation.addSlashes(unitNewName);
        updatedUnit = await unitsServices.updateUnits({
            checkUnitId,
            checkNewName,
        });
        if (!updatedUnit) return res.status(404).json({ message: "לא נמצאה יחידה" });
        await updatedUnit.save();
        res.status(200).json({ message: "היחידה עודכנה בהצלחה" });
    } catch (err) {
        res.status(500).json({ messgae: err.messgae });
    }
};

exports.deleteUnit = async (req, res) => {
    try {
        const { unitId } = req.body;
        await unitsServices.deleteUnit(unitId);
        return res.status(200).json();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
