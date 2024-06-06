const mongoose = require("mongoose");
const { DeviceStatus } = require("../constants/DeviceStatus");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    serialNumber: {
        type: String,
        trim: true,
        required: true,
    },
    deviceTypeId: {
        type: Schema.Types.ObjectId,
        ref: "DeviceType",
        required: true,
    },
    deviceType: {
        type: String,
        trim: true,
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: "Units",
        required: true,
    },
    status: {
        type: String,
        enum: [
            DeviceStatus.AT_WORK,
            DeviceStatus.DEFECTIVE,
            DeviceStatus.DEFECTIVE_RETURN,
            DeviceStatus.FIXED,
            DeviceStatus.FIXED_RETURN,
            DeviceStatus.WAIT_TO_WORK,
        ],
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
    voucherIn: {
        type: Schema.Types.ObjectId,
        ref: "Voucher",
    },
    voucherOut: {
        type: Schema.Types.ObjectId,
        ref: "Voucher",
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
});

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
