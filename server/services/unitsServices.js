const Units = require("../models/Units");

exports.findAllUnits = async () => await Units.find().populate("brigade");

exports.findUnitByName = async (checkUnitName) => {
    return await Units.findOne({ unitsName: checkUnitName });
};

exports.addUnit = async (checkUnits) => {
    return new Units({ unitsName: checkUnits.unitsName, brigade: checkUnits.brigade });
};

exports.findUnitById = async (checkUnitId) => await Units.findById(checkUnitId);

exports.updateUnits = async (request) => {
    const { checkUnitId, checkNewName } = request;
    return await Units.findByIdAndUpdate(checkUnitId, {
        unitsName: checkNewName,
    });
};

exports.findUnitsAndDelete = async (checkUnitsId) => {
    return await Units.findByIdAndDelete(checkUnitsId);
};
