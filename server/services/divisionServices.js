const Division = require("../models/Division");


exports.findAllDivisions = async () => await Division.find();

exports.findDivisionById = async (checkDivisionId) => await Division.findById(checkDivisionId);

exports.addDivision = async (checkDivisionName) => new Division({ divisionName: checkDivisionName });

exports.updateDivisionName = async (request) => {
    const { checkDivisionId, checkNewName } = request;
    return await Division.findByIdAndUpdate(checkDivisionId, { divisionName: checkNewName });
}

