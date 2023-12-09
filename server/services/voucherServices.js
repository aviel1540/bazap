const Project = require('../models/Project');
const Voucher = require('../models/Voucher');

exports.addVoucher = async(request) => {
    return new Voucher ({
        unit: request.checkUnits,
        recievedBy: request.checkRecievedBy,
        arrivedBy: request.checkArrivedBy
    })
}

exports.showVoucherList = async (projectId) => {
    return Project.findById(projectId).populate('vouchersList').exec().then((project) => {
        return project.vouchersList;
    }).catch((err) => {
        return err;
    });
}
