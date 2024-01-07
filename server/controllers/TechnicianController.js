const technicianServices = require("../services/technicianServices");
const escape = require("escape-html");
const validation = require("../utils/validation");

exports.getAllTechnicians = async (req, res) => {
    let technicians;
    try {
        technicians = await technicianServices.findAllTechnicians();
        if (!technicians) {
            return res.status(404).json({ message: "לא קיימים טכנאים" });
        }
        return res.status(200).json(technicians);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.addNewTechnician = async (req, res) => {
    const techName = escape(req.body.techName);
    let newTechnician;
    try {
        if (!techName) return res.status(400).json({ message: "יש למלא את כל השדות" });
        const checkDeviceName = validation.addSlashes(techName);
        newTechnician = await technicianServices.addTechnician(checkDeviceName);
        await newTechnician.save();
        return res.status(200).json(newTechnician);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

exports.deleteTechnician = async (req, res) => {
    try {
        const { technicianId } = req.body;
        await technicianServices.deleteTechnician(technicianId);
        return res.status(200).json();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
