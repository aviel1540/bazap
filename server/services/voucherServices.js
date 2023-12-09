const Voucher = require('../models/Voucher');

exports.addVoucher = async(request) => {
    return new Voucher ({
        unit: request.checkUnits,
        recievedBy: request.checkRecievedBy,
        arrivedBy: request.checkArrivedBy
    })
}