const Division = require("../models/Division");


exports.findAllDivisions = async () => await Division.find();

exports.findDivisionById = async (checkDivisionId) => await Division.findById(checkDivisionId);

exports.addDivision = async (checkDivisionName) => new Division({ division_name: checkDivisionName });

exports.updateDivisionName = async (request) => {
    const { checkDivisionId, checkNewName } = request;
    return await Division.findByIdAndUpdate(checkDivisionId, { division_name: checkNewName });
}

exports.findDivisionByName = async(checkDivisionName) => await Division.findOne({ division_name: checkDivisionName });


exports.deleteDivision = async (checkDivisionId) => await Division.findByIdAndDelete(checkDivisionId);
