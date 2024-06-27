const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DeviceStatus } = require("../constants/DeviceStatus");


const accessoriesSchema = new Schema({
    deviceTypeId: {
        type: Schema.Types.ObjectId,
        ref: "DeviceType",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: "Units",
    },
    status: {
        type: String,
        enum: [
            DeviceStatus.AT_WORK,
            DeviceStatus.WAIT_TO_WORK,
            DeviceStatus.FINISHED,
            DeviceStatus.FINISHED_OUT
        ],
        default: DeviceStatus.WAIT_TO_WORK,
    },
    fix: {
        type: Number,
        default: 0
    },
    defective: {
        type : Number,
        default: 0
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

const Accessories = mongoose.model("Accessories", accessoriesSchema);
module.exports = Accessories;
