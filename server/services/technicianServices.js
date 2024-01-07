const Technician = require("../models/Technician");

exports.findAllTechnicians = async () => await Technician.find();

exports.addTechnician = async (checkTechName) => {
    return new Technician({ techName: checkTechName });
};

exports.deleteTechnician = async (technicianId) => await Technician.findByIdAndDelete(technicianId);
