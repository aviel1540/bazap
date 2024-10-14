const Brigade = require("../models/Brigade");

exports.addBrigade = async (bridage) => {
    return new Brigade({ brigadeName: bridage.brigadeName, division: bridage.division });
};

exports.findBrigadeByName = async (brigadeName) => {
    await Brigade.findOne({ brigadeName: brigadeName });
};

exports.findAllBrigades = async () => await Brigade.find().populate("division");

exports.findBrigadeById = async (checkBrigadeId) => await Brigade.findById(checkBrigadeId);

exports.updateBrigadeNewName = async (request) => {
    const { checkBrigadeId, brigadeNewName } = request;
    return Brigade.findByIdAndUpdate(checkBrigadeId, {
        brigadeName: brigadeNewName,
    });
};

exports.deleteBrigade = async (brigadeId) => {
    await Brigade.findByIdAndDelete(brigadeId);
};
