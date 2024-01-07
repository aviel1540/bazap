const Project = require("../models/Project");
const Voucher = require("../models/Voucher");

exports.addVoucher = async (request) => {
    return new Voucher({
        unit: request.checkUnitName,
        receivedBy: request.checkreceivedBy,
        arrivedBy: request.checkArrivedBy,
        type: Boolean(request.type),
    });
};

exports.showVoucherList = async (projectId) => await Voucher.find({ project: projectId }).populate("deviceList").populate("Units");
exports.findVoucherById = async (checkVoucherId) => await Voucher.findById(checkVoucherId).populate("deviceList").populate("project");

exports.deleteVoucher = async (checkVoucherId) => await Voucher.findByIdAndDelete(checkVoucherId);
