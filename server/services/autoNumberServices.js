const AutoNumber = require('../models/autoNumber');

exports.findAutoNumber = async() => await AutoNumber.find();

exports.findAutoNumberAndUpdate = async(autoId,number) => {
    return await AutoNumber.findByIdAndUpdate(autoId, {
        voucherNumber : number + 1
    })
    
}


exports.createAutoNumber = async() => {
    return new AutoNumber({voucherNumber: 0});
}