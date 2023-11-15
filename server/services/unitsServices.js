const Units = require("../models/Units");

exports.findAllUnits = async () => await Units.find();

exports.findUnitByName = async (checkUnitName) => {
    return await Units.findOne({ unitsName: checkUnitName });
}

exports.addUnit = async (checkUnits) => { return new Units({ unitsName: checkUnits }) }

exports.findUnitById = async (checkUnitId) => await Units.findById(checkUnitId);

exports.updateUnits = async (request) => {
    const { checkUnitId, checkNewName } = request;
    return await Units.findByIdAndUpdate(checkUnitId, {
        unitsName: checkNewName
    })
}