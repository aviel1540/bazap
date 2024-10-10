const Project = require("../models/Project");
const Voucher = require("../models/Voucher");

exports.addVoucher = async (request) => {
    return new Voucher({
        voucherNumber: request.voucherNumber,
        unit: request.checkUnitName,
        receivedBy: request.checkreceivedBy,
        arrivedBy: request.checkArrivedBy,
        type: request.type,
        project: request.checkProjectId,
    });
};

exports.showVoucherList = async (projectId) => await Voucher.find({ project: projectId }).populate("deviceList").populate("Units");
exports.findVoucherById = async (checkVoucherId) => {
    return await Voucher.findById(checkVoucherId)
        .populate("unit")
        .populate("project")
        .populate({
            path: "deviceList",
            populate: {
                path: "deviceTypeId",
                model: "DeviceType",
            },
        })
        .populate({
            path: "accessoriesList",
            populate: {
                path: "deviceTypeId",
                model: "DeviceType",
            },
        });
};

exports.deleteVoucher = async (checkVoucherId) => await Voucher.findByIdAndDelete(checkVoucherId);

exports.updateVoucherProject = async ({request}) => {
    const {checkVoucherId, checkProjectId} = request
    return await Voucher.findByIdAndUpdate(checkVoucherId, {
        project : checkProjectId
    })
}
