const Units = require("../models/Units");

exports.findAllUnits = async () => await Units.find();

exports.findUnitByName = async (checkUnitName) => {
    return await Units.findOne({ unitsName: checkUnitName });
}


exports.addUnit = async (checkUnits) => { return new Units({ unitsName: checkUnits }) }

