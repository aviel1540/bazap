const mongoose = require("mongoose");
const { DeviceStatus } = require("../constants/DeviceStatus");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    catalogNumber: {
        type: String,
        trim: true,
        required: true,
    },
    serialNumber: {
        type: String,
        trim: true,
        required: true,
    },
    deviceType: {
        type: String,
        trim: true,
        required: true,
    },
    unit: {
        type: String,
        trim: true,
        required: true,
    },
    status: {
        type: String,
        enum: [DeviceStatus.AT_WORK, DeviceStatus.DEFECTIVE, DeviceStatus.DEFECTIVE_RETURN, DeviceStatus.FIXED, DeviceStatus.FIXED_RETURN],
        default: DeviceStatus.WAIT_TO_WORK,
    },
    technician: {
        type: Schema.Types.ObjectId,
        ref: "Technician",
    },
    notes: {
        type: String,
        trim: true,
        default: null,
    },
    voucherNumber: {
        type: Schema.Types.ObjectId,
        ref: "Voucher",
    },
    projectName: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
});

const Device = mongoose.model("device", deviceSchema);
module.exports = Device;
