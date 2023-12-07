const Voucher = require('../models/Voucher');

exports.addVoucher = async(request) => {
    new Voucher ({
        unit: request.checkUnits,
        recievedBy: checkRecievedBy,
        arrivedBy: checkArrivedBy
    })
}